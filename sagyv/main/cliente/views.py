from django.views.generic import TemplateView,View
from main.models import Cliente

class IndexView(TemplateView):
	template_name = "cliente/index.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context["clientes"] = Cliente.objects.all()
		return context


class CrearClienteView(View):
	def post(self, request):
		pass

class CrearDescuentoView(View):
	def post(self, request):
		pass

index = IndexView.as_view()