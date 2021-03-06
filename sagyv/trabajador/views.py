# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.db import transaction
from django.views.generic import View, ListView

from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto

from trabajador.models import Trabajador
from trabajador.models import Afp
from trabajador.models import SistemaSalud
from trabajador.models import EstadoCivil
from trabajador.models import EstadoVacacion
from trabajador.models import Vacacion
from trabajador.models import BoletaTrabajador
from trabajador.models import TipoTrabajador

from utils.views import LoginRequiredMixin
from utils import enums


class IndexList(LoginRequiredMixin, ListView):
    model = Trabajador
    queryset = Trabajador.objects.order_by('id')
    context_object_name = 'trabajadores'
    template_name = 'trabajador/index.html'

    def get_context_data(self, *args, **kwargs):
        data = super(IndexList, self).get_context_data(*args, **kwargs)

        data['lista_afps'] = Afp.objects.order_by('id')
        data['tipo_trabajador'] = TipoTrabajador.objects.order_by('id')
        data['lista_sistema_salud'] = SistemaSalud.objects.order_by('id')
        data['estados_civiles'] = EstadoCivil.objects.order_by('id')
        data['estados_vacacion'] = EstadoVacacion.objects.order_by('id')

        return data


class TrabajadorMixin(object):
    def request_data(self):
        self.id_trabajador = self.request.POST.get('id')
        self.nombre = self.request.POST.get('nombre')
        self.apellido = self.request.POST.get('apellido')
        self.rut = self.request.POST.get('rut')
        self.domicilio = self.request.POST.get('domicilio')
        self.nacimiento = self.request.POST.get('fechaNacimiento')
        self.fecha_inicio_contrato = self.request.POST.get('inicioContrato')
        self.vigencia_licencia = self.request.POST.get('vigenciaLicencia')
        self.afp_id = self.request.POST.get('afp')
        self.sistema_salud_id = self.request.POST.get('sistemaSalud')
        self.estado_civil_id = self.request.POST.get('estadoCivil')
        self.estado_vacacion_id = self.request.POST.get('estadoVacacion')

        tipo = self.request.POST.get('tipoTrabajador')
        self.tipo_trabajador = TipoTrabajador.objects.get(pk=int(tipo))

    def get_trabajador_json(self, worker):
        dato = {
            'id': worker.id,
            'nombre': worker.nombre,
            'apellido': worker.apellido,
            'rut': worker.rut,
            'domicilio': worker.domicilio,
            'nacimiento': convierte_fecha_texto(worker.nacimiento),
            'fechaInicioContrato': convierte_fecha_texto(worker.fecha_inicio_contrato),
            'vigenciaLicencia': convierte_fecha_texto(worker.vigencia_licencia),
            'afp': self.get_afp(worker),
            'sistemaSalud': self.get_sistema_salud(worker),
            'estadoCivil': self.get_estado_civil(worker),
            'estadoVacacion': self.get_estado_vacacion(worker),
            'boleta': self.get_boleta(worker),
            'tipo': self.get_tipo(worker)
        }

        return dato

    def get_afp(self, worker):
        data = {'id': None, 'nombre': 'No dispone'}

        if worker.tipo_trabajador.id == enums.TipoTrabajador.CHOFER:
            data['id'] = worker.afp.id
            data['nombre'] = worker.afp.nombre

        return data

    def get_sistema_salud(self, worker):
        data = {'id': None, 'nombre': 'No dispone'}

        if worker.tipo_trabajador.id == enums.TipoTrabajador.CHOFER:
            data['id'] = worker.sistema_salud.id
            data['nombre'] = worker.sistema_salud.nombre

        return data

    def get_estado_civil(self, worker):
        return {
            'id' : worker.estado_civil.id,
            'nombre' : worker.estado_civil.nombre
        }

    def get_estado_vacacion(self, worker):
        return {
            'id': worker.get_id_vacacion(),
            'nombre': worker.get_vacacion()
        }

    def get_boleta(self, worker):
        json_boleta = {
            'boletaInicial': None,
            'boletaActual': None,
            'boletaFinal': None
        }

        boletas = worker.boletatrabajador_set.filter(activo=True).order_by('id')

        if len(boletas) > 0:
            json_boleta['boletaInicial'] = boletas[0].boleta_inicial
            json_boleta['boletaActual'] = boletas[0].actual
            json_boleta['boletaFinal'] = boletas[0].boleta_final

        return json_boleta

    def get_tipo(self, worker):
        return {
            'id': worker.tipo_trabajador.id,
            'nombre': worker.tipo_trabajador.nombre
        }


class CrearTrabajadorView(LoginRequiredMixin, View, TrabajadorMixin):

    @transaction.atomic
    def post(self, req):
        self.request_data()
        trabajador = self.crear_trabajador()

        if self.estado_vacacion_id is not None:
            estado_vacaciones = EstadoVacacion.objects.get(pk=self.estado_vacacion_id)
            vacacion = self.crear_vacacion(trabajador, estado_vacaciones)

        dato = self.get_trabajador_json(trabajador)
        return JsonResponse(dato, safe=False)

    def crear_trabajador(self):
        if self.afp_id is not None:
            afp = Afp.objects.get(pk=self.afp_id)
        else:
            afp = None

        if self.sistema_salud_id is not None:
            sistema_salud = SistemaSalud.objects.get(pk=self.sistema_salud_id)
        else:
            sistema_salud = None

        if self.estado_civil_id is not None:
            estado_civil = EstadoCivil.objects.get(pk=self.estado_civil_id)
        else:
            estado_civil = None

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
        trabajador.tipo_trabajador = self.tipo_trabajador
        trabajador.save()

        return trabajador

    def crear_vacacion(self, trabajador, estado_vacacion):
        vacacion = Vacacion()
        vacacion.trabajador = trabajador
        vacacion.estado_vacacion = estado_vacacion
        vacacion.save()

        return vacacion


class ModificarTrabajadorView(LoginRequiredMixin, View, TrabajadorMixin):

    @transaction.atomic
    def post(self, req):
        self.request_data()
        trabajador = self._edit_trabajador(self.id_trabajador)
        dato = self.get_trabajador_json(trabajador)
        return JsonResponse(dato, safe=False)

    def _edit_trabajador(self, id_trabajador):
        if self.tipo_trabajador.id == enums.TipoTrabajador.CHOFER:
            afp = Afp.objects.get(pk=self.afp_id)
            sistema_salud = SistemaSalud.objects.get(pk=self.sistema_salud_id)
        else:
            afp = None
            sistema_salud = None

        estado_civil = EstadoCivil.objects.get(pk=self.estado_civil_id)

        trabajador = Trabajador.objects.get(pk=id_trabajador)
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


class ObtenerTrabajadorView(LoginRequiredMixin, View, TrabajadorMixin):

    def get(self, req):
        id_trabajador = req.GET.get('id')
        worker = Trabajador.objects.get(pk=id_trabajador)

        dato = self.get_trabajador_json(worker)
        return JsonResponse(dato, safe=False)


class EliminarTrabajadorView(LoginRequiredMixin, View):

    def post(self, req):
        id_trabajador = req.POST.get('id')
        worker = Trabajador.objects.get(pk=id_trabajador)
        worker.delete()

        dato = {'status': 'ok'}
        return JsonResponse(dato, safe=False)


class BuscarBoleta(LoginRequiredMixin, View):

    def get(self, req):
        trabajador_id = int(req.GET.get('id'))
        boleta = BoletaTrabajador.objects.get_talonario_activo(trabajador_id)

        data = {'boletaActual': 0, 'boletaInicial': 0, 'boletaFinal': 0}

        if boleta is not None:
            data['boletaActual'] = boleta.actual
            data['boletaInicial'] = boleta.boleta_inicial
            data['boletaFinal'] = boleta.boleta_final

        return JsonResponse(data, safe=False)


class GuardarBoleta(LoginRequiredMixin, View):

    @transaction.atomic
    def post(self, req):
        boleta_inicial = int(req.POST.get('boletaInicial'))
        boleta_final = int(req.POST.get('boletaFinal'))
        trabajador_id = int(req.POST.get('id'))
        boleta_trabajador = None

        if not(BoletaTrabajador.objects.filter(activo=True, trabajador_id=trabajador_id).exists()):
            boleta_trabajador = BoletaTrabajador()
        else:
            boleta_trabajador = BoletaTrabajador.objects.get(activo=True, trabajador_id=trabajador_id)

        trabajador = Trabajador.objects.get(pk=trabajador_id)

        boleta_trabajador.boleta_inicial = boleta_inicial
        boleta_trabajador.actual = boleta_inicial
        boleta_trabajador.boleta_final = boleta_final
        boleta_trabajador.trabajador = trabajador
        boleta_trabajador.activo = True
        boleta_trabajador.save()

        data = {
            'status': 'ok',
            'mensaje': ''
        }

        return JsonResponse(data, safe=False)


class Todos(LoginRequiredMixin, View, TrabajadorMixin):
    def get(self, req):
        trabajadores = Trabajador.objects.order_by('id')
        result = []

        for trabajador in trabajadores:
            result.append(self.get_trabajador_json(trabajador))

        return JsonResponse(result, safe=False)


index = IndexList.as_view()
todos = Todos.as_view()
obtener = ObtenerTrabajadorView.as_view()
crear = CrearTrabajadorView.as_view()
modificar = ModificarTrabajadorView.as_view()
eliminar = EliminarTrabajadorView.as_view()
buscar_boleta = BuscarBoleta.as_view()
guardar_boleta = GuardarBoleta.as_view()
