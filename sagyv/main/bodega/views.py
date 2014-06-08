from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Producto, TipoCambioStock, HistorialStock

class IndexView(TemplateView):
	template_name = "bodega/index.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context["productos"] = Producto.objects.all()
		return context

def agregar_stock_compra(req):
	id_producto = req.POST.get("id")
	num_factura = req.POST.get("num_fact")
	stock_entra = req.POST.get("agregar_stock")

	accion = TipoCambioStock.objects.get(pk = 1)
	producto = Producto.objects.get(pk = id_producto)

	hsp = HistorialStock()
	hsp.producto = producto
	hsp.cantidad = stock_entra
	hsp.factura = num_factura
	hsp.save()

	if producto.stock is None:
		old_stock = 0
	else:
		old_stock = producto.stock
	
	new_stock = int(old_stock) + int(stock_entra)

	producto.stock = new_stock
	producto.save()

	return HttpResponse(new_stock)

index = IndexView.as_view()
