#-*- coding: utf-8 -*-
import json

from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder

from main.models import BoletaTrabajador
from main.models import Trabajador

def _get_talonarios():
    talonarios = []
    rs = BoletaTrabajador.objects.order_by("-fecha_creacion")

    for talonario in rs:
        talonarios.append({
            'id' : talonario.id,
            'inicial' : talonario.boleta_inicial,
            'ultima' : talonario.boleta_final,
            'actual' : talonario.actual,
            'trabajador' : {
                'id' : talonario.trabajador.id,
                'nombre': talonario.trabajador.get_nombre_completo()
            }
        })

    return talonarios


def _cambio_estado_talonario_existente(trabajador):
    rs = BoletaTrabajador.objects.filter(trabajador = trabajador).exclude(activo = True)

    for talonario in rs:
        talonario.activo = False
        talonario.save()



class ObtenerTalonarios(View):

    def get(self, req):
        data = {'boletas': _get_talonarios()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class CrearTalonario(View):

    @transaction.atomic
    def post(self, req):
        inicial = int(req.POST.get('inicial'))
        final = int(req.POST.get('final'))
        trabajador_id = int(req.POST.get('idTrabajador'))

        trabajador = Trabajador.objects.get( pk = trabajador_id)

        _cambio_estado_talonario_existente(trabajador)

        nueva_boleta = BoletaTrabajador()
        nueva_boleta.boleta_inicial = inicial
        nueva_boleta.boleta_final = final
        nueva_boleta.actual = inicial
        nueva_boleta.trabajador = trabajador
        nueva_boleta.activo = True
        nueva_boleta.save()

        data = {'boletas': _get_talonarios()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class EditarTalonario(View):

    @transaction.atomic
    def post(self, req):
        talonario_id = int(req.POST.get('id'))
        trabajador_id = int(req.POST.get('idTrabajador'))

        talonario = BoletaTrabajador.objects.get( pk = talonario_id )
        trabajador = Trabajador.objects.get( pk = trabajador_id )

        talonario.trabajador = trabajador
        talonario.save()

        data = {'boletas': _get_talonarios()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

obtener_talonarios = ObtenerTalonarios.as_view()
crear_talonarios = CrearTalonario.as_view()
editar_talonario = EditarTalonario.as_view()
