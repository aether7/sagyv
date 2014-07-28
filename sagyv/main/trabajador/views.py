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


class CrearTrabajadorView(View):

    def post(self, req):
        pass


class ModificarTrabajadorView(View):

    def post(self, req):
        pass


class ObtenerTrabajadorView(View):

    def get(self, req, id_trabajador):
        pass


class EliminarTrabajadorView(View):

    def post(self, req):
        pass


class ValidarRutTrabajadorView(View):

    def get(self, req, rut):
        pass


index = IndexList.as_view()
obtener = ObtenerTrabajadorView.as_view()
validar_rut = ValidarRutTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
