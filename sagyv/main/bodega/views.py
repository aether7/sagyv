#-*- coding: utf-8 -*-
import json
import datetime
from django.core.serializers.json import DjangoJSONEncoder

from django.views.generic import TemplateView,View
from django.db import transaction
from django.http import HttpResponse
from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto
from django.views.decorators.csrf import csrf_exempt

from main.models import Producto
from main.models import TipoCambioStock
from main.models import HistorialStock
from main.models import PrecioProducto
from main.models import StockVehiculo
from main.models import Vehiculo
from main.models import GuiaDespacho
from main.models import Factura
from main.models import AbonoGuia

class IndexView(TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(IndexView, self).get_context_data(*args, **kwargs)
        context["productos"] = self.get_productos()
        context["productos_guia"] = Producto.objects.exclude(tipo_producto_id = 3).order_by("id")
        context["productos_transito"] = self.get_productos_transito()
        context["total_stock"] = self.get_stock_total()
        context["vehiculos"] = Vehiculo.objects.get_vehiculos_con_chofer()
        context["guias"] = self.get_guias()

        return context

    def get_productos(self):
        productos =  Producto.objects.exclude(orden = -1).order_by('orden')
        return productos

    def get_productos_transito(self):
        en_trancito = StockVehiculo.objects.get_stock_transito()
        return en_trancito

    def get_stock_total(self):
        total = StockVehiculo.objects.get_stock_consolidado()
        return total

    def get_guias(self):
        hoy = datetime.datetime.now()
        fecha = datetime.date(hoy.year, hoy.month, hoy.day)
        guias = GuiaDespacho.objects.all().order_by('id')
        return guias

class GuardarFactura(View):

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
            "status" : "ok",
            "guia" : {
                "id" : nueva_factura.id,
                "fecha" : convierte_fecha_texto(nueva_factura.fecha),
                "productos" : self.productosActualizados,
            }
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def ingreso_productos(self, guia, lista):
        for item in lista:
            if item["cantidad"] == "":
                cantidad = 0
            else:
                cantidad = int(item["cantidad"])

            producto = Producto.objects.get(pk = item["id"])

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

            producto = Producto.objects.get(codigo = item["codigo"])
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


class CrearGuiaDespachoView(View):

    @transaction.atomic
    def post(self,req):
        self.productosActualizados = []

        self.numero_guia = req.POST.get("numero")
        self.id_vehiculo = req.POST.get("vehiculo")
        self.fecha_creacion = req.POST.get("fecha")
        lista_producto = req.POST.get("productos")

        lista = json.loads(lista_producto)
        guia = self.crear_guia_despacho()

        if(self.id_vehiculo != None):
            self.carga_datos_salida(guia, lista)

        data = {
            "status" : "ok",
            "guia" : {
                "id" : guia.id,
                "numero" : guia.numero,
                "vehiculo" : guia.vehiculo.numero,
                "fecha" : convierte_fecha_texto(guia.fecha),
                "productos" : self.productosActualizados,
            }
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def crear_guia_despacho(self):
        movil = Vehiculo.objects.get(pk = self.id_vehiculo)

        guia_despacho = GuiaDespacho()
        guia_despacho.numero = self.numero_guia
        guia_despacho.vehiculo = movil
        guia_despacho.valor_total = 0
        guia_despacho.estado = False
        guia_despacho.save()

        return guia_despacho

    def carga_datos_salida(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id"])
            producto.stock -= cantidad
            producto.save()

            this_prod = {
                'id' : producto.id,
                'cantidad' : producto.stock
            }

            self.productosActualizados.append(this_prod)
            self.crear_historico(producto, cantidad, guia)
            self.modificar_stock_vehiculo(guia.vehiculo, producto, cantidad)

    def crear_historico(self, producto, cantidad, guia):
        historico = HistorialStock()
        historico.guia_despacho = guia
        historico.factura = None
        historico.producto = producto
        historico.cantidad = cantidad
        historico.es_recarga = False
        historico.save()

    def modificar_stock_vehiculo(self, vehiculo, producto, cantidad):

        if not StockVehiculo.objects.filter(vehiculo = vehiculo, producto = producto).exists():
            stock_vehiculo = StockVehiculo()
            stock_vehiculo.vehiculo = vehiculo
            stock_vehiculo.producto = producto
        else:
            stock_vehiculo = StockVehiculo.objects.get(vehiculo = vehiculo, producto = producto)

        stock_vehiculo.cantidad = cantidad
        stock_vehiculo.save()


class ObtenerVehiculosPorProductoView(View):

    def get(self, req):
        producto_id = int(req.GET.get("producto_id"))
        stocks_vehiculos = StockVehiculo.objects.filter(producto_id = producto_id)

        resultados = []

        for stock_vehiculo in stocks_vehiculos:
            resultados.append({
                "vehiculo" : {
                    "id" : stock_vehiculo.vehiculo.id,
                    "patente" : stock_vehiculo.vehiculo.patente,
                    "numero" : stock_vehiculo.vehiculo.numero
                },
                "producto" : {
                    "cantidad" : stock_vehiculo.cantidad,
                    "codigo" : stock_vehiculo.producto.codigo
                }
            })

        return HttpResponse(json.dumps(resultados), content_type="application/json")


class ObtenerGuiaDespasho(View):

    def get(self, req):
        guia_id = int(req.GET.get("guia_id"))
        productos = []

        guia = GuiaDespacho.objects.get(pk = guia_id)
        items = HistorialStock.objects.filter(guia_despacho = guia)

        for item in items:
            productos.append({
                "codigo" : item.producto.codigo,
                "cantidad" : item.cantidad,
                "es_recarga" : item.es_recarga,
                "id_producto" : item.producto.id
            })

        data = {
            "status" : "ok",
            "productos" : productos,
            "fecha" : convierte_fecha_texto(guia.fecha),
            "movil" : guia.vehiculo.numero,
            "numero_guia" : guia.numero
        }

        return HttpResponse(json.dumps(data), content_type="application/json")


class RecargaGuia(View):

    def post(self, req):
        self.productosActualizados = []
        id_guia = req.POST.get("id_guia")
        productos = json.loads(req.POST.get("productos"))
        monto = req.POST.get("monto")

        guia = GuiaDespacho.objects.get(pk = id_guia)
        historico = self.historial(productos, guia)

        resultados = {
            "status" : "ok",
            "productos" : self.productosActualizados
        }

        abono = AbonoGuia()
        abono.guia_despacho = guia
        abono.monto = int(monto)
        abono.save()

        return HttpResponse(json.dumps(resultados), content_type="application/json")

    def historial(self, productos, guia):
        for producto in productos:
            prod = Producto.objects.get(pk = int(producto['id']))
            cant = int(producto['cantidad'])

            historico = HistorialStock()
            historico.producto = prod
            historico.cantidad = cant
            historico.tipo_operacion = False
            historico.guia_despacho = guia
            historico.es_recarga = True
            historico.save()

            prod.stock = prod.stock - cant
            prod.save()

            this_prod = {
                'id': prod.id,
                'cantidad': prod.stock
            }
            self.productosActualizados.append(this_prod)
            self.actualizar_stock(prod, guia.vehiculo, cant)

    def actualizar_stock(self, producto_obj, vehiculo_obj, cantidad):
        try:
            stock_vehiculo = StockVehiculo.objects.get(producto = producto_obj)
            stock_vehiculo.cantidad = stock_vehiculo.cantidad + cantidad
            stock_vehiculo.save()
        except StockVehiculo.DoesNotExist:
            stock_vehiculo = StockVehiculo()
            stock_vehiculo.vehiculo = vehiculo_obj
            stock_vehiculo.producto = producto_obj
            stock_vehiculo.cantidad = cantidad
            stock_vehiculo.save()


class ObtenerIdGuia(View):

    def get(self, req):
        guia = GuiaDespacho.objects.get_ultimo_despacho_id()
        numero = not(guia is None) and guia.numero or 0

        result = {
            "status" : "ok",
            "next" : int(numero) + 1
        }

        return HttpResponse(json.dumps(result), content_type="application/json")


class FiltrarGuias(View):
    def get(self, req):
        fecha = req.GET.get("fecha")

        if fecha == "null" or fecha is None:
            guia_results = GuiaDespacho.objects.order_by("id")
        else:
            print "FECHA"
            print fecha
            guia_results = GuiaDespacho.objects.filter(fecha__startswith=fecha).order_by("id")

        guias = []

        for guia in guia_results:
            guias.append({
                "id": guia.id,
                "numero": guia.numero,
                "vehiculo": {
                    "id": guia.vehiculo_id,
                    "numero": guia.vehiculo.numero
                },
                "fecha": guia.fecha,
                "estado" : guia.estado
            })

        res = { "guias": guias }
        res = json.dumps(res, cls=DjangoJSONEncoder)

        return HttpResponse(res, content_type="application/json")


index = IndexView.as_view()
crea_guia = csrf_exempt(CrearGuiaDespachoView.as_view())
guardar_factura = csrf_exempt(GuardarFactura.as_view())
obtener_guia = ObtenerGuiaDespasho.as_view()
obtener_vehiculos_por_producto = ObtenerVehiculosPorProductoView.as_view()
recargar_guia = csrf_exempt(RecargaGuia.as_view())
obtener_id_guia = ObtenerIdGuia.as_view()
filtrar_guias = FiltrarGuias.as_view()
