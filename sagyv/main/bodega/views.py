#-*- coding: utf-8 -*-
import json

from django.views.generic import TemplateView,View
from django.db import transaction
from django.http import HttpResponse
from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto
from main.models import Producto, TipoCambioStock, HistorialStock
from main.models import PrecioProducto, StockVehiculo, Vehiculo
from main.models import GuiaDespacho

class IndexView(TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(IndexView, self).get_context_data(*args, **kwargs)
        context["productos"] = self.get_productos()
        context["productos_guia"] = Producto.objects.exclude(tipo_producto_id = 3).order_by("id")
        context["productos_transito"] = self.get_productos_transito()
        context["total_stock"] = self.get_stock_total()
        context["vehiculos"] = Vehiculo.objects.all().order_by("id")
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
        guias = GuiaDespacho.objects.filter(tipo_guia = 0)
        print guias
        return guias


class CrearGuiaDespachoView(View):

    @transaction.commit_on_success
    def post(self,req):
        self.productosActualizados = []
        self.numero_guia = req.POST.get("numero")
        self.id_vehiculo = req.POST.get("movil")
        self.factura = req.POST.get("factura")
        self.fecha_creacion = req.POST.get("fecha")
        lista_producto = req.POST.get("productos")

        lista = json.loads(lista_producto)

        guia = self.crear_guia_despacho()

        if(self.id_vehiculo != None):
            self.carga_datos_salida(guia, lista)

        elif(self.factura != None):
            self.carga_datos_ingreso(guia, lista)

        data = {
            "status" : "ok",
            "productos" : self.productosActualizados,
            "guia" : {
                "id" : guia.id,
                "numero" : guia.numero
            }
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def crear_guia_despacho(self):
        guia_despacho = GuiaDespacho()

        if self.id_vehiculo != None:
            guia_despacho.numero = self.numero_guia
            movil = Vehiculo.objects.get(pk = self.id_vehiculo)
            guia_despacho.tipo_guia = False
            guia_despacho.vehiculo = movil

        elif self.factura != None:
            guia_despacho.factura = self.factura
            guia_despacho.tipo_guia = True

        guia_despacho.save()

        return guia_despacho


    def carga_datos_ingreso(self, guia, lista):
        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id"])

            if producto.stock is None:
                producto.stock = cantidad
            else:
                producto.stock += cantidad

            producto.save()

            print cantidad

            this_prod = {
                'id': producto.id,
                'cantidad' : producto.stock
            }

            self.productosActualizados.append(this_prod)
            self.crear_historico(producto, cantidad, guia, True)

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
            self.crear_historico(producto, cantidad, guia, False)
            self.modificar_stock_vehiculo(guia.vehiculo, producto, cantidad)

    def crear_historico(self, producto, cantidad, guia, tipo_operacion):
        historico = HistorialStock()
        historico.producto = producto
        historico.cantidad = cantidad
        historico.tipo_operacion = tipo_operacion
        historico.guia_despacho = guia
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
                "cantidad" : item.cantidad
            })

        potato = {
            "status" : "ok",
            "productos" : productos,
            "fecha" : convierte_fecha_texto(guia.fecha),
            "movil" : guia.vehiculo.numero,
            "numero_guia" : guia.numero
        }

        return HttpResponse(json.dumps(potato), content_type="application/json")


index = IndexView.as_view()
crea_guia = CrearGuiaDespachoView.as_view()
obtener_guia = ObtenerGuiaDespasho.as_view()
obtener_vehiculos_por_producto = ObtenerVehiculosPorProductoView.as_view()
