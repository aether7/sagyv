#-*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import TemplateView,View
<<<<<<< fb5bf0a23adee9f1f870b7a9384b70762d1cce0d
from main.models import Trabajador, Producto, Vehiculo, GuiaDespacho
=======
from main.models import Trabajador, Producto, GuiaDespacho, HistorialStock
>>>>>>> 303e17003ae7823dc22ab88848b5b7b8289b9fb9

class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["vehiculos"] = Vehiculo.objects.order_by("id")

        return context


class BalanceLiquidacionView(View):
    def post(self, req):
        guia_despacho = req.POST.get('guia_despacho')
        id_trabajador = req.POST.get('id_trabajador')
        productos_json = req.POST.get('productos')
        productos = json.loads(productos_json)
        valor_total = 0

        for obj in productos:
            producto = Producto.objects.get(pk = obj["id"])
            precio = producto.get_precio_producto()
            valor_tmp = precio * int(obj["cantidad"])
            valor_total += valor_tmp

        dato = { 'valor': valor_total }

        return HttpResponse(json.dumps(dato), content_type="application/json")


class ObtenerGuiaDespacho(View):
    def get(self, req):
        numero_guia = req.GET.get('numero_guia')
        productos = []
        guia = GuiaDespacho.objects.get(numero = numero_guia)
        lote = HistorialStock.objects.filter(guia_despacho = guia)


        for item in lote:
            productos.append(
                {
                    'id': item.producto.id,
                    'codigo': item.producto.codigo,
                    'cantidad': item.cantidad,
                    'precio': item.producto.get_precio_producto()
                }
            )
        
        data = {
            'numero_guia': guia.numero,
            'id_vehiculo': guia.vehiculo.id,
            'productos': productos
        }

        return HttpResponse(json.dumps(datos), content_type="application/json")


index = IndexView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
balance_liquidacion = BalanceLiquidacionView.as_view()
