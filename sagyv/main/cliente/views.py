from django.views.generic import TemplateView,View

class IndexView(TemplateView):
	template_name = "cliente/index.html"

	def get_context_data(self, **kwargs):
		return ""


index = IndexView.as_view()