import json
from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Producto, TipoCambioStock, HistorialStock, PrecioProducto

class IndexView(TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["productos"] = Producto.objects.all()
        return context


class UpdateStockProductoView(View):
    def post(self,req):
        id_producto = req.POST.get("id")
        num_factura = req.POST.get("num_fact")
        stock_entra = req.POST.get("agregar_stock")
        tipo_accion = req.POST.get("accion")

        accion = TipoCambioStock.objects.get(pk = tipo_accion)
        producto = Producto.objects.get(pk = id_producto)
        old_stock = producto.stock

        hsp = HistorialStock()
        hsp.producto = producto
        hsp.cantidad = stock_entra
        hsp.factura = num_factura
        hsp.save()

        if tipo_accion == "1":
            new_stock = int(old_stock) + int(stock_entra)
        elif tipo_accion == "2":
            new_stock = int(old_stock) - int(stock_entra)

        producto.stock = new_stock
        producto.save()

        return HttpResponse(new_stock)


class UpdatePrecioProductoView(View):
    def post(self,req):
        id_producto = req.POST.get('id')
        precio = req.POST.get('precio')

        producto = Producto.objects.get(pk = id_producto)

        pp = PrecioProducto()
        pp.producto = producto
        pp.precio = precio
        pp.save()
        dato = {"precio": precio}
        
        json.dumps(dato)
        return HttpResponse(dato, content_type="application/json");


index = IndexView.as_view()
update_stock_producto = UpdateStockProductoView.as_view()
update_precio_producto = UpdatePrecioProductoView.as_view()
