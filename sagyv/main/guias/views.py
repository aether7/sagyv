from django.views.generic import TemplateView, View

from trabajador.models import Trabajador
from bodega.models import Vehiculo
from bodega.models import Movil

class Index(TemplateView):
    template_name = "guias/index.html"

    def get_context_data(self, *args, **kwargs):
        data = super(Index, self).get_context_data(*args, **kwargs)
        data['trabajadores'] = Trabajador.objects.order_by('id')
        data['moviles'] = Movil.objects.order_by('id')
        data['vehiculos'] = Vehiculo.objects.order_by('id')

        return data

index = Index.as_view()
