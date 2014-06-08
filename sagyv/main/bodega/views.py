from django.views.generic import TemplateView,View
from main.models import Producto

class IndexView(TemplateView):
	template_name = "bodega/index.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context["productos"] = Producto.objects.all()
		return context

def agregar_stock_compra(req):
	return HttpResponse('hi')

index = IndexView.as_view()
