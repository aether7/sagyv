import json
from django.http import HttpResponse
from django.views.generic import TemplateView,View
from main.models import Trabajador, Producto

class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["trabajadores"] = []

        for trabajador in Trabajador.objects.all():
            context["trabajadores"].append(json.dumps({
                "nombre" : trabajador.nombre,
                "apellido" : trabajador.apellido,
                "id" : trabajador.id,
                "nombre_completo" : trabajador.get_nombre_completo()
            }))

        context["productos"] = Producto.objects.all()
        return context


class BalanceLiquidacionView(View):
    def post(self, req):

        guia_despacho = req.POST.get('guia_despacho')
        id_trabajador = req.POST.get('id_trabajador')
        productos_json = req.POST.get('productos')

        #######################################
        # productos:[{id:10, cantidad:11},..] #
        #######################################
        productos = json.loads(productos_json)
        valor_total = 0

        for obj in productos:
            producto = Producto.objects.get(pk = obj["id"])
            precio = producto.get_precio_producto()
            valor_tmp = precio * int(obj["cantidad"])
            valor_total += valor_tmp

        dato = {'valor': valor_total}

        return HttpResponse(json.dumps(dato), content_type="application/json");


index = IndexView.as_view()
balance_liquidacion = BalanceLiquidacionView.as_view()
