from django.views.generic import TemplateView, View
from main.models import Vehiculo

class Index(TemplateView):
    template_name = "guias/index.html"

    def get_context_data(self, *args, **kwargs):
        data = super(Index, self).get_context_data(*args, **kwargs)
        data['vehiculos'] = Vehiculo.objects.order_by('id')

        return data

index = Index.as_view()
