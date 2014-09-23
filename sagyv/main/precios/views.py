import json
from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView
from main.models import Producto, PrecioProducto
from main.helpers.auth import permiso_admin

class IndexView(TemplateView):
    template_name = "precios/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        lista_precio = Producto.objects.exclude(tipo_producto_id = 3)
        lista_precio = lista_precio.exclude(codigo = 1515).order_by('orden')

        context['lista_precios'] = lista_precio
        context['lista_precios_garantias'] = Producto.objects.filter(tipo_producto_id = 3).order_by("id")

        return context


class UpdatePrecioProductoView(View):

    @transaction.atomic
    def post(self,req):
        cambios = req.POST.get("precios")
        cambios_productos = json.loads(cambios)

        for cambio in cambios_productos:
            producto = Producto.objects.get(pk = cambio["id"])

            precio_producto = PrecioProducto()
            precio_producto.producto = producto
            precio_producto.precio = cambio["valor"]
            precio_producto.save()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class UpdateStock(View):

    @transaction.atomic
    def post(self, req):
        productos_list = req.POST.get("productos")
        productos_list = json.loads(productos_list)

        for prod in productos_list:
            producto = Producto.objects.get(pk = int(prod.get("id")))
            producto.nivel_critico = int(prod.get("stock", 0))
            producto.save()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


index = permiso_admin(IndexView.as_view())
update_precios = UpdatePrecioProductoView.as_view()
update_stock = UpdateStock.as_view()
