# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.db import transaction
from django.views.generic import View

from trabajador.models import BoletaTrabajador
from trabajador.models import Trabajador


def get_talonario(talonario):
    data = {
        'id': talonario.id,
        'inicial': talonario.boleta_inicial,
        'ultima': talonario.boleta_final,
        'actual': talonario.actual,
        'trabajador': {
            'id': talonario.trabajador.id,
            'nombre': talonario.trabajador.get_nombre_completo()
        }
    }

    return data

def _get_talonarios():
    talonarios = []
    rs = BoletaTrabajador.objects.order_by("-fecha_creacion").exclude(activo=False)

    for talonario in rs:
        data = get_talonario(talonario)
        talonarios.append(data)

    return talonarios

def _cambio_estado_talonario_existente(trabajador):
    rs = BoletaTrabajador.objects.filter(trabajador=trabajador).exclude(activo=True)

    for talonario in rs:
        talonario.activo = False
        talonario.save()


class ObtenerTalonarios(View):
    def get(self, req):
        data = _get_talonarios()
        return JsonResponse(data, safe=False)


class CrearTalonario(View):

    @transaction.atomic
    def post(self, req):
        inicial = int(req.POST.get('inicial'))
        final = int(req.POST.get('ultima'))
        worker_obj = json.loads(req.POST.get('trabajador'))
        trabajador_id = int(worker_obj.get('id'))

        trabajador = Trabajador.objects.get(pk=trabajador_id)
        _cambio_estado_talonario_existente(trabajador)
        self.crear_talonario(inicial, final, trabajador)

        data = {'boletas': _get_talonarios()}
        return JsonResponse(data, safe=False)

    def crear_talonario(self, inicial, final, trabajador):
        nueva_boleta = BoletaTrabajador()
        nueva_boleta.boleta_inicial = inicial
        nueva_boleta.boleta_final = final
        nueva_boleta.actual = inicial
        nueva_boleta.trabajador = trabajador
        nueva_boleta.activo = True
        nueva_boleta.save()


class EditarTalonario(View):

    @transaction.atomic
    def post(self, req):
        talonario_id = int(req.POST.get('id'))
        worker_obj = json.loads(req.POST.get('trabajador'))
        trabajador_id = int(worker_obj.get('id'))

        talonario = BoletaTrabajador.objects.get(pk=talonario_id)
        trabajador = Trabajador.objects.get(pk=trabajador_id)

        talonario.trabajador = trabajador
        talonario.save()

        data = {'boletas': _get_talonarios()}
        return JsonResponse(data, safe=False)


class EliminarTalonario(View):

    @transaction.atomic
    def post(self, req):
        talonario_id = int(req.POST.get('id'))

        talonario = BoletaTrabajador.objects.get(pk=talonario_id)
        talonario.activo = False
        talonario.save()

        data = {'boletas': _get_talonarios()}
        return JsonResponse(data, safe=False)


obtener_talonarios = ObtenerTalonarios.as_view()
crear_talonario = CrearTalonario.as_view()
editar_talonario = EditarTalonario.as_view()
eliminar_talonario = EliminarTalonario.as_view()
