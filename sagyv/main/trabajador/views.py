import json
from datetime import datetime
from datetime import date

from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView

from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto
from main.models import Trabajador, Afp, SistemaSalud, EstadoCivil, EstadoVacacion, Vacacion

class IndexList(ListView):
    model = Trabajador
    queryset = Trabajador.objects.all().order_by("id")
    context_object_name = "trabajadores"
    template_name = "trabajador/index.html"

    def get_context_data(self,*args,**kwargs):
        data = super(IndexList, self).get_context_data(*args, **kwargs)

        data["lista_afps"] = Afp.objects.all().order_by("id")
        data["lista_sistema_salud"] = SistemaSalud.objects.all().order_by("id")
        data["estados_civiles"] = EstadoCivil.objects.all().order_by("id")
        data["estados_vacacion"] = EstadoVacacion.objects.all().order_by("id")

        return data


class CrearTrabajadorView(View):

    @transaction.commit_on_success
    def post(self, req):
        nombre = req.POST.get("nombre")
        apellido = req.POST.get("apellido")
        rut = req.POST.get("rut")
        domicilio = req.POST.get("domicilio")
        nacimiento = req.POST.get("fecha_nacimiento")
        fecha_inicio_contrato = req.POST.get("inicio_contrato")
        vigencia_licencia = req.POST.get("vigencia_licencia")
        afp = req.POST.get("afp")
        sistema_salud = req.POST.get("sistema_salud")
        estado_civil = req.POST.get("estado_civil")

        estado_vacacion_id = req.POST.get("estado_vacacion")
        estado_vacaciones = EstadoVacacion.objects.get(pk = estado_vacacion_id)

        trabajador = self.crear_trabajador(nombre, apellido, rut, domicilio, nacimiento,
            fecha_inicio_contrato, vigencia_licencia, afp, sistema_salud, estado_civil)

        vacacion = self.crear_vacacion(trabajador, estado_vacaciones)

        dato = {
            "status" : "ok",
            "id" : trabajador.id,
            "nombre" : trabajador.nombre,
            "apellido" : trabajador.apellido,
            "rut" : trabajador.rut,
            "estado_vacaciones" : trabajador.get_vacacion()
        }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def crear_trabajador(self, nombre, apellido, rut, domicilio, nacimiento,
            fecha_inicio_contrato, vigencia_licencia, afp_id, sistema_salud_id, estado_civil_id):

        afp = Afp.objects.get(pk = afp_id)
        sistema_salud = SistemaSalud.objects.get(pk = sistema_salud_id)
        estado_civil = EstadoCivil.objects.get(pk = estado_civil_id)

        print nacimiento

        trabajador = Trabajador()
        trabajador.nombre = nombre
        trabajador.apellido = apellido
        trabajador.rut = rut
        trabajador.domicilio = domicilio
        trabajador.nacimiento = convierte_texto_fecha(nacimiento)
        trabajador.fecha_inicio_contrato = convierte_texto_fecha(fecha_inicio_contrato)
        trabajador.vigencia_licencia = convierte_texto_fecha(vigencia_licencia)
        trabajador.afp = afp
        trabajador.sistema_salud = sistema_salud
        trabajador.estado_civil = estado_civil
        trabajador.save()

        return trabajador

    def crear_vacacion(self, trabajador, estado_vacacion):
        vacacion = Vacacion()
        vacacion.trabajador = trabajador
        vacacion.estado_vacacion = estado_vacacion
        #vacacion.fecha_inicio =
        #vacacion.dias_restantes =
        #vacacion.activo =
        vacacion.save()

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

        pass


class ObtenerTrabajadorView(View):

    def get(self, req):
        id_trabajador = req.GET.get("id")
        worker = Trabajador.objects.get(pk = id_trabajador)
        dato = {
            "nombre" : worker.nombre,
            "apellido" : worker.apellido,
            "rut" : worker.rut,
            "domicilio" : worker.domicilio,
            "nacimiento" : convierte_fecha_texto(worker.nacimiento),
            "fecha_inicio_contrato" : convierte_fecha_texto(worker.fecha_inicio_contrato),
            "vigencia_licencia" : convierte_fecha_texto(worker.vigencia_licencia),
            "afp" : worker.afp.nombre,
            "sistema_salud" : worker.sistema_salud.nombre,
            "estado_civil" : worker.estado_civil.nombre,
            "estado_vacacion" : worker.get_vacacion()
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class EliminarTrabajadorView(View):

    def post(self, req):
        id_trabajador = req.POST.get("id")
        worker = Trabajador.objects.get(pk = id_trabajador)
        worker.delete()

        dato = { "status" : "ok"}

        return HttpResponse(json.dumps(dato), content_type="application/json")


index = IndexList.as_view()
obtener = ObtenerTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
