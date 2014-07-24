from django.views.generic import View, TemplateView, ListView
from main.models import Trabajador

class IndexList(ListView):
    model = Trabajador
    queryset = Trabajador.objects.all().order_by("id")
    context_object_name = "trabajadores"
    template_name = "trabajador/index.html"


index = IndexList.as_view()
