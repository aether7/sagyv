# -*- coding: utf-8 -*-
import json
from django.core.serializers.json import DjangoJSONEncoder

from django.views.generic import TemplateView, View
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from helpers.fecha import convierte_fecha_texto

from .models import Producto
from .models import HistorialStock
from .models import StockVehiculo
from .models import Vehiculo
from .models import GuiaDespacho
from .models import Factura

from utils.views import LoginRequiredMixin


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(IndexView, self).get_context_data(*args, **kwargs)
        context["vehiculos"] = Vehiculo.objects.get_vehiculos_con_chofer()
        context["productos_guia"] = Producto.objects.get_productos_filtrados()

        return context


class GuardarFactura(LoginRequiredMixin, View):

    def __init__(self, *args, **kwargs):
        super(GuardarFactura, self).__init__(*args, **kwargs)
        self.productosActualizados = []

    @transaction.atomic
    def post(self, req):
        self.productosActualizados = []
        factura = req.POST.get('factura')
        fecha = req.POST.get('fecha')
        precio = req.POST.get('valor')
        productos = req.POST.get('productos')
        garantias = req.POST.get('garantias')

        nueva_factura = Factura()
        nueva_factura.numero_factura = int(factura)
        nueva_factura.precio = precio
        nueva_factura.save()

        lista_producto = json.loads(productos)
        lista_garantias = json.loads(garantias)
        self.ingreso_productos(nueva_factura, lista_producto)
        self.salida_garantias(nueva_factura, lista_garantias)

        data = {
            "status": "ok",
            "guia": {
                "id": nueva_factura.id,
                "fecha": convierte_fecha_texto(nueva_factura.fecha),
                "productos": self.productosActualizados,
            }
        }

        return JsonResponse(data, safe=False)

    def ingreso_productos(self, guia, lista):
        for item in lista:
            if item["cantidad"] == "":
                cantidad = 0
            else:
                cantidad = int(item["cantidad"])

            producto = Producto.objects.get(pk=item["id"])

            if producto.stock is None:
                producto.stock = cantidad
            else:
                producto.stock += cantidad

            producto.save()

            this_prod = {
                'id': producto.id,
                'cantidad': producto.stock
            }

            self.productosActualizados.append(this_prod)
            self.crear_historico(producto, cantidad, guia, True)

    def salida_garantias(self, guia, lista):
        for item in lista:
            if item["cantidad"] == "":
                cantidad = 0
            else:
                cantidad = int(item["cantidad"])

            producto = Producto.objects.get(codigo=item["codigo"])
            producto.stock -= cantidad
            producto.save()

            this_garantia = {
                'id' : producto.id,
                'cantidad': producto.stock
            }

            self.productosActualizados.append(this_garantia)
            self.crear_historico(producto, cantidad, guia, True)

    def crear_historico(self, producto, cantidad, guia, tipo_operacion):
        historico = HistorialStock()
        historico.guia_despacho = None
        historico.factura = guia
        historico.producto = producto
        historico.cantidad = cantidad
        historico.es_recarga = False
        historico.save()


class ObtenerVehiculosPorProductoView(LoginRequiredMixin, View):

    def get(self, req):
        producto_id = int(req.GET.get("producto_id"))
        stocks_vehiculos = StockVehiculo.objects.filter(producto_id=producto_id)

        resultados = []

        for stock_vehiculo in stocks_vehiculos:
            resultados.append({
                "vehiculo": {
                    "id": stock_vehiculo.vehiculo.id,
                    "patente": stock_vehiculo.vehiculo.patente,
                    "numero": stock_vehiculo.vehiculo.patente
                },
                "producto": {
                    "cantidad": stock_vehiculo.cantidad,
                    "codigo": stock_vehiculo.producto.codigo
                }
            })

        return JsonResponse(resultados, safe=False)


class FiltrarGuias(LoginRequiredMixin, View):
    def get(self, req):
        fecha = req.GET.get("fecha")

        if fecha == "null" or fecha is None:
            guia_results = GuiaDespacho.objects.order_by("-id")
        else:
            guia_results = GuiaDespacho.objects.filter(fecha__startswith=fecha).order_by("-id")

        guias = []

        for guia in guia_results:
            guias.append({
                "id": guia.id,
                "numero": guia.numero,
                "vehiculo": {
                    "id": guia.movil.vehiculo_id,
                    "numero": guia.movil.vehiculo.patente
                },
                "fecha": convierte_fecha_texto(guia.fecha),
                "estado": guia.estado
            })

        res = {"guias": guias}
        return JsonResponse(res, safe=False)


class ObtenerProductos(LoginRequiredMixin, View):
    def get(self, req):
        productos = Producto.objects.exclude(orden=-1).order_by('orden')
        response = []

        for producto in productos:
            response.append({
                "id": producto.id,
                "codigo": producto.codigo,
                "stock": producto.stock,
                "tipo": {
                    "id": producto.tipo_producto.id,
                    "nombre": producto.tipo_producto.nombre
                },
                "precio": producto.get_precio_producto(),
                "colorAlerta": producto.get_clase_nivel_alerta()
            })

        response = json.dumps(response, cls=DjangoJSONEncoder)
        return HttpResponse(response, content_type="application/json")


class ObtenerProductosTransito(LoginRequiredMixin, View):
    def get(self, req):
        productos = StockVehiculo.objects.get_stock_transito()
        response = []

        for producto in productos:
            response.append({
                "id": producto.producto_id,
                "codigo": producto.codigo,
                "tipo": producto.nombre,
                "stock": producto.cantidad
            })

        return JsonResponse(response, safe=False)


class ObtenerConsolidados(LoginRequiredMixin, View):
    def get(self, req):
        consolidados = StockVehiculo.objects.get_stock_consolidado()
        res = []

        for consolidado in consolidados:
            res.append({
                'id': consolidado.producto_id,
                'codigo': consolidado.codigo,
                'cantidad': consolidado.cantidad
            })

        return JsonResponse(res, safe=False)


class ObtenerVehiculosSeleccionables(LoginRequiredMixin, View):
    def get(self, req):
        vehiculos = Vehiculo.objects.get_vehiculos_con_chofer()
        response = []

        for vehiculo in vehiculos:
            response.append({
                "id": vehiculo.id,
                "numero": vehiculo.patente,
                "patente": vehiculo.patente,
                "estado_ultima_guia": vehiculo.get_estado_ultima_guia()
            })

        return JsonResponse(response, safe=False)


class ObtenerDetalleConsolidado(LoginRequiredMixin, View):
    def get(self, req):
        producto_id = int(req.GET.get('producto_id'))
        producto = Producto.objects.get(pk=producto_id)
        items = StockVehiculo.objects.filter(producto=producto)

        res = {
            'bodega': producto.stock,
            'transito': []
        }

        for item in items:
            res['transito'].append({
                'id': item.vehiculo.id,
                'numero': item.vehiculo.patente,
                'codigo': item.producto.codigo,
                'patente': item.vehiculo.patente,
                'cantidad': item.cantidad
            })

        return JsonResponse(res, safe=False)


index = IndexView.as_view()
guardar_factura = GuardarFactura.as_view()
obtener_vehiculos_por_producto = ObtenerVehiculosPorProductoView.as_view()
filtrar_guias = FiltrarGuias.as_view()
obtener_consolidados = ObtenerConsolidados.as_view()
obtener_productos = ObtenerProductos.as_view()
obtener_productos_transito = ObtenerProductosTransito.as_view()
obtener_vehiculos_seleccionables = ObtenerVehiculosSeleccionables.as_view()
obtener_detalle_consolidado = ObtenerDetalleConsolidado.as_view()
