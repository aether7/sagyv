import json
from django.http import HttpResponse
from django.views.generic import View, TemplateView, ListView
from main.models import Trabajador, Afp, SistemaSalud, EstadoCivil, EstadoVacacion, Vacacion

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
        nombre = req.POST.get("nombre")
        apellido = req.POST.get("apellido")
        rut = req.POST.get("rut")
        domicilio = req.POST.get("domicilio")
        nacimiento = req.POST.get("fechaNacimiento")
        fecha_inicio_contrato = req.POST.get("inicioContrato")
        vigencia_licencia = req.POST.get("vigenciaLicencia")
        afp = req.POST.get("afp")
        sistema_salud = req.POST.get("sistemaSalud")
        estado_civil = req.POST.get("estadoCivil")

        #Vacaciones
        estado_vacacion = req.POST.get("estadoVacacion")
        estadoVacacion = EstadoVacacion.objects.get(pk = estado_vacacion)

        trabajador = Trabajador()
        trabajador.nombre = nombre
        trabajador.apellido = apellido
        trabajador.rut = rut
        trabajador.domicilio = domicilio
        trabajador.nacimiento = nacimiento
        trabajador.fecha_inicio_contrato = fecha_inicio_contrato
        trabajador.vigencia_licencia = vigencia_licencia
        trabajador.afp = afp
        trabajador.sistema_salud = sistema_salud
        trabajador.estado_civil = estado_civil
        trabajador.save()

        vacacion = Vacacion()
        vacacion.trabajador = trabajador
        vacacion.estado_vacacion = estadoVacacion
        #vacacion.fecha_inicio = 
        #vacacion.dias_restantes =
        #vacacion.activo =
        vacacion.save()

        dato = {
            "status" : "ok",
            "id_trabajador" : trabajador.id,
            "nombre" : trabajador.nombre,
            "apellido" : trabajador.apellido,
            "rut" : trabajador.rut
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")
        

class ObtenerTrabajadorView(View):

    def get(self, req, id_trabajador):
        id_trabajdor = req.GET.get("id")
        trabajador = Trabajador.objects.get(pk = id_trabajador)

        dato = {
            "nombre" : "",
            "apellido" : "",
            "rut" : "",
            "domicilio" : "",
            "nacimiento" : "",
            "fecha_inicio_contrato" : "",
            "vigencia_licencia" : "",
            "afp" : "",
            "sistema_salud" : "",
            "estado_civil" : ""
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class EliminarTrabajadorView(View):

    def post(self, req):
        pass


index = IndexList.as_view()
obtener = ObtenerTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
