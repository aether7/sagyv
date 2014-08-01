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


class UpdateStockProductoView(View):

    def post(self,req):
        id_producto = req.POST.get("id")
        num_factura = req.POST.get("num_fact")
        stock_entra = req.POST.get("agregar_stock")
        tipo_accion = req.POST.get("accion")

        #accion = TipoCambioStock.objects.get(pk = tipo_accion)
        producto = Producto.objects.get(pk = id_producto)
        old_stock = producto.stock

        hsp = HistorialStock()
        hsp.producto = producto
        hsp.cantidad = stock_entra
        hsp.factura = num_factura
        hsp.tipo_operacion = tipo_accion
        hsp.save()

        new_stock = int(old_stock)

        if tipo_accion:
            new_stock += int(stock_entra)
        else:
            new_stock -= int(stock_entra)

        producto.stock = new_stock
        producto.save()

        return HttpResponse(new_stock)

class CrearGuiaDespachoView(View):

    @transaction.commit_on_success
    def post(self,req):
        #{{id_producto:xxx, cantidad:xxx}...}
        lista_producto = req.POST.get("lista_producto")
        self.numero_guia = req.POST.get("numero_guia")
        self.id_vehiculo = req.POST.get("id_vehiculo")
        self.num_factura = req.POST.get("num_factura")
        #es probable que no se utilice.
        self.fecha_creacion = req.POST.get("fecha_creacion")

        lista = json.loads(lista_producto)
        guia = self.crear_guia_despacho()

        if(self.id_vehiculo != ""):
            self.carga_datos_salida(guia,lista)

        if(self.factura != ""):
            self.carga_datos_ingreso(guia,lista)

    def crear_guia_despacho(self):
        guia_despacho = GuiaDespacho()
        #guia_despacho.fecha = CAMPO AUTO
        guia_despacho.numero = self.numero_guia

        if self.id_vehiculo == "":
            guia_despacho.factura = self.factura
            guia_despacho.tipo_guia = True
            guia_despacho.save()
        elif self.factura == "":
            movil = Vehiculo.objects.get(pk = self.id_vehiculo)
            guia_despacho.vehiculo = movil
            guia_despacho.tipo_guia = False
            guia_despacho.save()
        else:
            guia_despacho = None

        return guia_despacho

    def carga_datos_ingreso(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id_producto"])
            producto.stock += cantidad
            producto.save()

            self.crear_historico(producto, cantidad, guia.numero ,False)

        return "OK"


    def carga_datos_salida(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk = item["id_producto"])
            producto.stock -= cantidad
            producto.save()

            self.crear_historico(producto, cantidad, guia.numero ,True)

        return "OK"

    def crear_historico(self, producto, cantidad, guia_numero,tipo_operacion):
        historico = HistorialStock()
        historico.producto = producto
        historico.cantidad = cantidad
        #historico.fecha = AUTO DATE
        historico.tipo_operacion = tipo_operacion
        historico.guia_despacho = guia_numero
        historico.save()


index = IndexView.as_view()
update_stock = UpdateStockProductoView.as_view()
crea_guia = CrearGuiaDespachoView.as_view()
