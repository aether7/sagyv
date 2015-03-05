import json

from django.db import transaction
from django.http import JsonResponse
from django.views.generic import View
from helpers.fecha import convierte_fecha_texto
from utils.views import LoginRequiredMixin

from .models import HistorialStock
from .models import GuiaDespacho
from .models import Producto
from .models import StockVehiculo
from .models import AbonoGuia
from .models import Vehiculo
from .models import Movil


class ObtenerGuiaDespacho(LoginRequiredMixin, View):
    def get(self, req):
        guia_id = int(req.GET.get("guia_id"))
        productos = []

        guia = GuiaDespacho.objects.get(pk=guia_id)
        items = HistorialStock.objects.get_productos_guia_recarga(guia)

        for item in items:
            productos.append({
                'codigo': item['producto__codigo'],
                'cantidad': item['cantidad_total'],
                'es_recarga': item['es_recarga'],
                'id_producto': item['producto_id']
            })

        data = {
            'productos': productos,
            'fecha': convierte_fecha_texto(guia.fecha),
            'movil': guia.movil.vehiculo.patente,
            'numero_guia': guia.numero
        }

        return JsonResponse(data, safe=False)


class CrearGuiaDespachoView(LoginRequiredMixin, View):
    def __init__(self, *args, **kwargs):
        super(CrearGuiaDespachoView, self).__init__(*args, **kwargs)
        self.productosActualizados = []
        self.numero_guia = None
        self.id_vehiculo = None
        self.kilometraje = None
        self.fecha_creacion = None

    @transaction.atomic
    def post(self, req):
        self.productosActualizados = []

        self.numero_guia = req.POST.get("numero")
        self.id_vehiculo = req.POST.get("vehiculo")
        self.kilometraje = req.POST.get("kilometraje")
        self.fecha_creacion = req.POST.get("fecha")
        lista_producto = req.POST.get("productos")

        lista = json.loads(lista_producto)
        guia = self.crear_guia_despacho()

        if self.id_vehiculo is not None:
            self.carga_datos_salida(guia, lista)

        data = {
            "status": "ok",
            "guia": {
                "id": guia.id,
                "numero": guia.numero,
                "vehiculo": guia.movil.vehiculo.patente,
                "fecha": guia.fecha,
                "productos": self.productosActualizados,
            }
        }

        return JsonResponse(data, safe=False)

    def crear_guia_despacho(self):
        vehiculo_obj = Vehiculo.objects.get(pk=self.id_vehiculo)
        vehiculo_obj.km = int(self.kilometraje)
        vehiculo_obj.save()

        movil = Movil.objects.get(vehiculo=vehiculo_obj)

        guia_despacho = GuiaDespacho()
        guia_despacho.numero = self.numero_guia
        guia_despacho.movil = movil
        guia_despacho.valor_total = 0
        guia_despacho.estado = False
        guia_despacho.save()

        return guia_despacho

    def carga_datos_salida(self, guia, lista):

        for item in lista:
            cantidad = int(item["cantidad"])
            producto = Producto.objects.get(pk=item["id"])
            producto.stock -= cantidad
            producto.save()

            this_prod = {
                'id': producto.id,
                'cantidad': producto.stock
            }

            self.productosActualizados.append(this_prod)
            self.crear_historico(producto, cantidad, guia)
            self.modificar_stock_vehiculo(guia.movil.vehiculo, producto, cantidad)

    def crear_historico(self, producto, cantidad, guia):
        historico = HistorialStock()
        historico.guia_despacho = guia
        historico.factura = None
        historico.producto = producto
        historico.cantidad = cantidad
        historico.es_recarga = False
        historico.save()

    def modificar_stock_vehiculo(self, vehiculo, producto, cantidad):

        if not StockVehiculo.objects.filter(vehiculo=vehiculo, producto=producto).exists():
            stock_vehiculo = StockVehiculo()
            stock_vehiculo.vehiculo = vehiculo
            stock_vehiculo.producto = producto
        else:
            stock_vehiculo = StockVehiculo.objects.get(vehiculo=vehiculo, producto=producto)

        stock_vehiculo.cantidad = cantidad
        stock_vehiculo.save()


class RecargaGuia(LoginRequiredMixin, View):
    def __init__(self, *args, **kwargs):
        super(RecargaGuia, self).__init__(*args, **kwargs)
        self.productosActualizados = []

    def post(self, req):
        self.productosActualizados = []
        id_guia = req.POST.get("id_guia")
        productos = json.loads(req.POST.get("productos"))
        monto = req.POST.get("monto")

        guia = GuiaDespacho.objects.get(pk=id_guia)
        self.historial(productos, guia)

        resultados = {
            "status": "ok",
            "productos": self.productosActualizados
        }

        abono = AbonoGuia()
        abono.guia_despacho = guia
        abono.monto = int(monto)
        abono.save()

        return JsonResponse(resultados, safe=False)

    def historial(self, productos, guia):
        for producto in productos:
            prod = Producto.objects.get(pk=int(producto['id']))
            cant = int(producto['cantidad'])

            historico = HistorialStock()
            historico.producto = prod
            historico.cantidad = cant
            historico.tipo_operacion = False
            historico.guia_despacho = guia
            historico.es_recarga = True
            historico.save()

            prod.stock -= cant
            prod.save()

            this_prod = {
                'id': prod.id,
                'cantidad': prod.stock
            }

            self.productosActualizados.append(this_prod)
            self.actualizar_stock(prod, guia.vehiculo, cant)

    def actualizar_stock(self, producto_obj, vehiculo_obj, cantidad):
        try:
            stock_vehiculo = StockVehiculo.objects.get(producto=producto_obj)
            stock_vehiculo.cantidad = stock_vehiculo.cantidad + cantidad
            stock_vehiculo.save()
        except StockVehiculo.DoesNotExist:
            stock_vehiculo = StockVehiculo()
            stock_vehiculo.vehiculo = vehiculo_obj
            stock_vehiculo.producto = producto_obj
            stock_vehiculo.cantidad = cantidad
            stock_vehiculo.save()


class ObtenerIdGuia(LoginRequiredMixin, View):

    def get(self, req):
        guia = GuiaDespacho.objects.get_ultimo_despacho_id()
        numero = guia is not None and guia.numero or 0

        result = {
            "status": "ok",
            "next": int(numero) + 1
        }

        return JsonResponse(result, safe=False)

crea_guia = CrearGuiaDespachoView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
recargar_guia = RecargaGuia.as_view()
obtener_id_guia = ObtenerIdGuia.as_view()
