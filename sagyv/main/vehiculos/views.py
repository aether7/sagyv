from django.views.generic import View, TemplateView
from main.models import Vehiculo

class IndexView(TemplateView):
    template_name = "vehiculos/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['vehiculos'] = Vehiculo.objects.all()
        return context
        


index = IndexView.as_view()
