import json
from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.managers import StockManager
from main.models import Producto, TipoCambioStock, HistorialStock, PrecioProducto, StockVehiculo

class IndexView(TemplateView):
    template_name = "bodega/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["productos"] = self.get_productos()
        context["productos_transito"] = self.get_productos_transito()
        context["total_stock"] = self.get_stock_total()

        return context

    def get_productos(self):
        productos =  Producto.objects.exclude(orden = -1).order_by('orden')
        return productos

    def get_productos_transito(self):
        en_trancito = StockVehiculo.stockManager.get_stock()
        return en_trancito

    def get_stock_total(self):
        total = StockManager().get_stock_total()
        return total


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

        new_stock = int(old_stock)

        if tipo_accion == "1":
            new_stock += int(stock_entra)
        elif tipo_accion == "2":
            new_stock -= int(stock_entra)

        producto.stock = new_stock
        producto.save()

        return HttpResponse(new_stock)

class UpdatePrecioProductoView(View):

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
        return HttpResponse(json.dumps(dato), content_type="application/json");

index = IndexView.as_view()
update_stock = UpdateStockProductoView.as_view()
update_precio = UpdatePrecioProductoView.as_view()
