import json
from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView
from main.models import Producto, PrecioProducto

class IndexView(TemplateView):
    template_name = "precios/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['lista_precios'] = Producto.objects.exclude(tipo_producto_id = 3).order_by('orden')
        context['lista_precios_garantias'] = Producto.objects.filter(tipo_producto_id = 3)
        return context


class UpdatePrecioProductoView(View):

    def post(self,req):
        cambios = req.POST.get("precios")
        print cambios
        cambios_productos = json.loads(cambios)

        for cambio in cambios_productos:
            producto = Producto.objects.get(pk = cambio["id"])

            precio_producto = PrecioProducto()
            precio_producto.producto = producto
            precio_producto.precio = cambio["valor"]
            precio_producto.save()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


index = IndexView.as_view()
update_precios = UpdatePrecioProductoView.as_view()
