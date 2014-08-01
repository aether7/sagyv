#-*- coding: utf-8 -*-
import json
from django.views.generic import TemplateView,View
from django.db import transaction
from django.http import HttpResponse
from main.models import Producto, TipoCambioStock, HistorialStock
from main.models import PrecioProducto, StockVehiculo, Vehiculo
from main.models import GuiaDespacho

class IndexView(TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(IndexView, self).get_context_data(*args, **kwargs)
        context["productos"] = self.get_productos()
        context["productos_transito"] = self.get_productos_transito()
        context["total_stock"] = self.get_stock_total()
        context["vehiculos"] = Vehiculo.objects.all().order_by("id")

        return context

    def get_productos(self):
        productos =  Producto.objects.exclude(orden = -1).order_by('orden')
        return productos

    def get_productos_transito(self):
        en_trancito = StockVehiculo.objects.get_stock()
        return en_trancito

    def get_stock_total(self):
        total = StockVehiculo.objects.get_stock_total()
        return total


class CrearGuiaDespachoView(View):

    @transaction.commit_on_success
    def post(self,req):
        self.numero_guia = req.POST.get("numero")
        self.id_vehiculo = req.POST.get("movil")
        self.factura = req.POST.get("num_factura")
        #es probable que no se utilice.
        self.fecha_creacion = req.POST.get("fecha")
        lista_producto = req.POST.get("productos")

        lista = json.loads(lista_producto)
        guia = self.crear_guia_despacho()

        if(self.id_vehiculo != ""):
            self.carga_datos_salida(guia, lista)
        elif(self.factura != ""):
            self.carga_datos_ingreso(guia, lista)

        data = {
            "status" : "ok",
            "guia" : {
                "id" : guia.id,
                "numero" : guia.numero
            }
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def crear_guia_despacho(self):
        guia_despacho = GuiaDespacho()
        guia_despacho.numero = self.numero_guia

        if self.id_vehiculo == "":
            guia_despacho.factura = self.factura
            guia_despacho.tipo_guia = True
        elif self.factura == "":
            movil = Vehiculo.objects.get(pk = self.id_vehiculo)
            guia_despacho.vehiculo = movil
            guia_despacho.tipo_guia = False

        guia_despacho.save()

        return guia_despacho

    def carga_datos_ingreso(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id"])
            producto.stock += cantidad
            producto.save()

            self.crear_historico(producto, cantidad, guia.numero ,False)

    def carga_datos_salida(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id"])
            producto.stock -= cantidad
            producto.save()

            self.crear_historico(producto, cantidad, guia.numero ,True)

    def crear_historico(self, producto, cantidad, guia_numero,tipo_operacion):
        historico = HistorialStock()
        historico.producto = producto
        historico.cantidad = cantidad
        historico.tipo_operacion = tipo_operacion
        historico.guia_despacho = guia_numero
        historico.save()


index = IndexView.as_view()
crea_guia = CrearGuiaDespachoView.as_view()
