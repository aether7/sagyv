import json
from django.views.generic import TemplateView,View
from main.models import Trabajador

class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["trabajadores"] = []

        for trabajador in Trabajador.objects.all():
            context["trabajadores"].append(json.dumps({
                "nombre" : trabajador.nombre,
                "apellido" : trabajador.apellido,
                "id" : trabajador.id,
                "nombre_completo" : trabajador.get_nombre_completo()
            }))

        return context

index = IndexView.as_view()
