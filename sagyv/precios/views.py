import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView
from main.helpers.auth import permiso_admin

from bodega.models import Producto
from bodega.models import PrecioProducto

class IndexView(TemplateView):
    template_name = 'precios/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        productos = Producto.objects.get_productos_filtrados()
        garantias = Producto.objects.get_garantias()

        context['lista_precios'] = productos
        context['lista_precios_garantias'] = garantias

        return context


class UpdatePrecioProductoView(View):
    @transaction.atomic
    def post(self, req):
        cambios = req.POST.get('precios')
        cambios_productos = json.loads(cambios)

        for cambio in cambios_productos:
            producto = Producto.objects.get(pk = cambio['id'])

            precio_producto = PrecioProducto()
            precio_producto.producto = producto
            precio_producto.precio = cambio['valor']
            precio_producto.save()

        dato = { 'status': 'ok' }
        return HttpResponse(json.dumps(dato), content_type='application/json')


class UpdateStock(View):

    @transaction.atomic
    def post(self, req):
        productos_list = req.POST.get('productos')
        productos_list = json.loads(productos_list)

        for prod in productos_list:
            producto = Producto.objects.get(pk = int(prod.get('id')))
            producto.nivel_critico = int(prod.get('stock', 0))
            producto.save()

        dato = { 'status': 'ok' }
        return HttpResponse(json.dumps(dato), content_type='application/json')


class ObtenerProductos(View):
    def get(self, req):
        productos = Producto.objects.get_productos_filtrados()
        res = []

        for producto in productos:
            res.append({
                'id': producto.id,
                'precio': producto.get_precio_producto(),
                'codigo': producto.codigo
            })

        res = json.dumps(res, cls = DjangoJSONEncoder)
        return HttpResponse(res, content_type='application/json')


class ObtenerGarantias(View):
    def get(self, req):
        garantias = Producto.objects.get_garantias()
        res = []

        for producto in garantias:
            res.append({
                'id': producto.id,
                'precio': producto.get_precio_producto(),
                'codigo': producto.codigo
            })

        res = json.dumps(res, cls = DjangoJSONEncoder)
        return HttpResponse(res, content_type='application/json')


class ObtenerStocks(View):
    def get(self, req):
        lista_precio = Producto.objects.exclude(tipo_producto_id = 3)
        lista_precio = lista_precio.exclude(codigo = 1515).order_by('orden')

        res = []

        for producto in lista_precio:
            res.append({
                'id': producto.id,
                'nivelCritico': producto.nivel_critico,
                'codigo': producto.codigo
            })

        res = json.dumps(res, cls = DjangoJSONEncoder)
        return HttpResponse(res, content_type='application/json')


index = permiso_admin(IndexView.as_view())
obtener_productos = ObtenerProductos.as_view()
obtener_garantias = ObtenerGarantias.as_view()
obtener_stocks = ObtenerStocks.as_view()
update_precios = UpdatePrecioProductoView.as_view()
update_stock = UpdateStock.as_view()
