from django.views.generic import View, TemplateView, ListView
from main.models import Trabajador, Afp, SistemaSalud, EstadoCivil, EstadoVacacion

class IndexList(ListView):
    model = Trabajador
    queryset = Trabajador.objects.all().order_by("id")
    context_object_name = "trabajadores"
    template_name = "trabajador/index.html"

    def get_context_data(self,*args,**kwargs):
        data = super(IndexList, self).get_context_data(*args,**kwargs)

        data["lista_afps"] = Afp.objects.all().order_by("id")
        data["lista_sistema_salud"] = SistemaSalud.objects.all().order_by("id")
        data["estados_civiles"] = EstadoCivil.objects.all().order_by("id")
        data["estados_vacacion"] = EstadoVacacion.objects.all().order_by("id")

        return data


index = IndexList.as_view()
