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
        self.nombre = req.POST.get("nombre")
        self.apellido = req.POST.get("apellido")
        self.rut = req.POST.get("rut")
        self.domicilio = req.POST.get("domicilio")
        self.nacimiento = req.POST.get("fecha_nacimiento")
        self.fecha_inicio_contrato = req.POST.get("inicio_contrato")
        self.vigencia_licencia = req.POST.get("vigencia_licencia")
        self.afp_id = req.POST.get("afp")
        self.sistema_salud_id = req.POST.get("sistema_salud")
        self.estado_civil_id = req.POST.get("estado_civil")
        self.estado_vacacion_id = req.POST.get("estado_vacacion")

        estado_vacaciones = EstadoVacacion.objects.get(pk = self.estado_vacacion_id)

        trabajador = self.crear_trabajador()
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

    def crear_trabajador(self):

        afp = Afp.objects.get(pk = self.afp_id)
        sistema_salud = SistemaSalud.objects.get(pk = self.sistema_salud_id)
        estado_civil = EstadoCivil.objects.get(pk = self.estado_civil_id)

        trabajador = Trabajador()
        trabajador.nombre = self.nombre
        trabajador.apellido = self.apellido
        trabajador.rut = self.rut
        trabajador.domicilio = self.domicilio
        trabajador.nacimiento = convierte_texto_fecha(self.nacimiento)
        trabajador.fecha_inicio_contrato = convierte_texto_fecha(self.fecha_inicio_contrato)
        trabajador.vigencia_licencia = convierte_texto_fecha(self.vigencia_licencia)
        trabajador.afp = afp
        trabajador.sistema_salud = sistema_salud
        trabajador.estado_civil = estado_civil
        trabajador.save()

        return trabajador

    def crear_vacacion(self, trabajador, estado_vacacion):
        vacacion = Vacacion()
        vacacion.trabajador = trabajador
        vacacion.estado_vacacion = estado_vacacion
        vacacion.save()


class ModificarTrabajadorView(View):

    def post(self, req):
        self.id_trabajador = req.POST.get("id")
        self.nombre = req.POST.get("nombre")
        self.apellido = req.POST.get("apellido")
        self.rut = req.POST.get("rut")
        self.domicilio = req.POST.get("domicilio")
        self.nacimiento = req.POST.get("fecha_nacimiento")
        self.fecha_inicio_contrato = req.POST.get("inicio_contrato")
        self.vigencia_licencia = req.POST.get("vigencia_licencia")
        self.afp_id = req.POST.get("afp")
        self.sistema_salud_id = req.POST.get("sistema_salud")
        self.estado_civil_id = req.POST.get("estado_civil")

        trabajador = self.edit_trabajador(self.id_trabajador)

        dato = {
            "status" : "ok",
            "id" : trabajador.id,
            "nombre" : trabajador.nombre,
            "apellido" : trabajador.apellido,
            "rut" : trabajador.rut,
            "estado_vacaciones" : trabajador.get_vacacion()
        }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def edit_trabajador(self, id_trabajador):
        afp = Afp.objects.get(pk = self.afp_id)
        sistema_salud = SistemaSalud.objects.get(pk = self.sistema_salud_id)
        estado_civil = EstadoCivil.objects.get(pk = self.estado_civil_id)

        trabajador = Trabajador.objects.get(pk = id_trabajador)
        trabajador.nombre = self.nombre
        trabajador.apellido = self.apellido
        trabajador.rut = self.rut
        trabajador.domicilio = self.domicilio
        trabajador.nacimiento = convierte_texto_fecha(self.nacimiento)
        trabajador.fecha_inicio_contrato = convierte_texto_fecha(self.fecha_inicio_contrato)
        trabajador.vigencia_licencia = convierte_texto_fecha(self.vigencia_licencia)
        trabajador.sistema_salud = sistema_salud
        trabajador.estado_civil = estado_civil
        trabajador.save()

        return trabajador


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
            "afp" : {
                "id" : worker.afp.id,
                "nombre" : worker.afp.nombre,
            },
            "sistema_salud" : {
                "id" : worker.sistema_salud.id,
                "nombre" : worker.sistema_salud.nombre
            },
            "estado_civil" : {
                "id" : worker.estado_civil.id,
                "nombre" : worker.estado_civil.nombre
            },
            "estado_vacacion" : {
                "id" : worker.get_id_vacacion(),
                "nombre" : worker.get_vacacion()
            }
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class EliminarTrabajadorView(View):

    def post(self, req):
        id_trabajador = req.POST.get("id")
        worker = Trabajador.objects.get(pk = id_trabajador)
        worker.delete()

        dato = { "status" : "ok" }

        return HttpResponse(json.dumps(dato), content_type="application/json")


index = IndexList.as_view()
obtener = ObtenerTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
