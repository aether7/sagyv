import json

from django.db import transaction
from django.http import HttpResponse
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder
from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto

from main.models import HistorialStock
from main.models import GuiaDespacho
from main.models import Producto
from main.models import StockVehiculo
from main.models import AbonoGuia
from main.models import Vehiculo


class ObtenerGuiaDespacho(View):

    def get(self, req):
        guia_id = int(req.GET.get("guia_id"))
        productos = []

        guia = GuiaDespacho.objects.get(pk = guia_id)
        items = HistorialStock.objects.get_productos_guia_recarga(guia)

        for item in items:
            productos.append({
                'codigo': item['producto__codigo'],
                'cantidad': item['cantidad_total'],
                'es_recarga': item['es_recarga'],
                'id_producto': item['producto_id']
            })

        data = {
            'productos' : productos,
            'fecha' : convierte_fecha_texto(guia.fecha),
            'movil' : guia.vehiculo.patente,
            'numero_guia' : guia.numero
        }

        return HttpResponse(json.dumps(data), content_type="application/json")


class CrearGuiaDespachoView(View):

    @transaction.atomic
    def post(self,req):
        print req.POST
        self.productosActualizados = []

        self.numero_guia = req.POST.get("numero")
        self.id_vehiculo = req.POST.get("vehiculo")
        self.kilometraje = req.POST.get("kilometraje")
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
                "vehiculo" : guia.vehiculo.patente,
                "fecha" : guia.fecha,
                "productos" : self.productosActualizados,
            }
        }

        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type="application/json")

    def crear_guia_despacho(self):
        movil = Vehiculo.objects.get(pk = self.id_vehiculo)
        movil.km = int(self.kilometraje)
        movil.save()

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
        numero = guia is not None and guia.numero or 0

        result = {
            "status" : "ok",
            "next" : int(numero) + 1
        }

        return HttpResponse(json.dumps(result), content_type="application/json")

crea_guia = CrearGuiaDespachoView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
recargar_guia = RecargaGuia.as_view()
obtener_id_guia = ObtenerIdGuia.as_view()
