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
        nombre = req.POST.get("nombre")
        apellido = req.POST.get("apellido")
        rut = req.POST.get("rut")
        domicilio = req.POST.get("domicilio")
        nacimiento = req.POST.get("nacimiento")
        fecha_inicio_contrato = req.POST.get("fecha_inicio_contrato")
        vigencia_licencia = req.POST.get("vigencia_licencia")
        afp = req.POST.get("afp")
        sistema_salud = req.POST.get("sistema_salud")
        estado_civil = req.POST.get("estado_civil")
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

    def get(self, req, dni):
        existe = False
        try:
            trabajador = Trabajador.objects.get(rut = dni)
            existe = False
        except Trabajador.DoesNotExist:
            existe = True

        dato = { "existe": existe }
        return HttpResponse(json.dumps(dato), content_type="application/json")
        


index = IndexList.as_view()
obtener = ObtenerTrabajadorView.as_view()
validar_rut = ValidarRutTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
