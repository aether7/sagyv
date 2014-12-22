#-*- coding: utf-8 -*-
import json

from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder

from main.models import Terminal
from main.models import EstadoTerminal
from main.models import HistorialCambioVehiculo
from main.models import HistorialEstadoTerminal
from main.models import Movil

def _get_terminales():
    terminales = []

    rs = Terminal.objects.exclude(estado_id = EstadoTerminal.RETIRADO).order_by('-movil')

    for terminal in rs:
        if terminal.movil is None:
            id_movil = 0
            numero_movil = None
        else:
            id_movil = terminal.movil.id
            numero_movil = terminal.movil.numero

        if terminal.estado.id == EstadoTerminal.MANTENCION:
            show_opt = False
        else:
            show_opt = True

        terminales.append({
            'id': terminal.id,
            'codigo': terminal.codigo,
            'movil': {
                'id': id_movil,
                'numero': numero_movil
            },
            'estado': {
                'id': terminal.estado.id,
                'nombre': terminal.estado.nombre,
                'show_opt' : show_opt
            }
        })

    return terminales

def anexar_vehiculo(terminal, movil, estado):
    histvehiculo = HistorialCambioVehiculo()

    histvehiculo.terminal = terminal
    histvehiculo.movil = movil
    histvehiculo.estado = estado
    histvehiculo.save()

def cambiar_estado_terminal(terminal, estado):
    #cambio del registro
    terminal.estado = estado
    terminal.movil = None
    terminal.save()

    #historial terminal
    histo = HistorialEstadoTerminal()
    histo.terminal = terminal
    histo.estado = terminal.estado
    histo.save()

    return terminal

def get_terminal_json(terminal):
    data = {
        "id": terminal.id,
        "codigo": terminal.codigo,
        "estado": {
            "id": terminal.estado.id,
            "nombre": terminal.estado.nombre
        },
        "movil": {
            "id": terminal.movil.id,
            "numero": terminal.movil.numero
        }
    }

    return data


class ObtenerTerminales(View):

    def get(self, req):
        data = { 'terminales': _get_terminales() }

        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class CrearTerminal(View):

    @transaction.atomic
    def post(self, req):
        codigo = req.POST.get('codigo')
        movil_obj = json.loads(req.POST.get('movil'))
        movil_id = int(movil_obj.get('id'))

        terminal = self.crear_terminal(movil_id, codigo)

        data = get_terminal_json(terminal)
        data = json.dumps(data, cls=DjangoJSONEncoder)

        return HttpResponse(data, content_type="application/json")

    def crear_terminal(self, movil_id, codigo):
        estado = EstadoTerminal.objects.get(pk = EstadoTerminal.ACTIVO)
        movil = Movil.objects.get(pk = movil_id)

        terminal = Terminal()
        terminal.codigo = codigo
        terminal.estado = estado
        terminal.movil = movil
        terminal.save()

        return terminal

    def crear_historico_vehiculo(self, obj_terminal):
        historico = HistorialCambioVehiculo()
        historico_existente = HistorialCambioVehiculo.objects.filter(estado = True, vehiculo = obj_terminal.vehiculo)

        for h in historico_existente:
            h.estado = False
            h.save()

            terminales = Terminal.objects.filter(vehiculo = h.vehiculo).exclude(pk = obj_terminal.id)

            for t in terminales:
                t.vehiculo = None
                t.save()

        historico.terminal = obj_terminal
        historico.vehiculo = obj_terminal.vehiculo
        historico.estado = True
        historico.save()

        return historico

    def crear_historico_estado(self, obj_terminal):
        state = HistorialEstadoTerminal()
        state.terminal = obj_terminal
        state.estado = obj_terminal.estado
        state.save()

        return state


class RemoverTerminal(View):

    @transaction.atomic
    def post(self, req):

        id_term = int(req.POST.get('id'))
        state = EstadoTerminal.objects.get(pk = EstadoTerminal.RETIRADO)

        terminal = Terminal.objects.get(pk = int(id_term))
        movil = terminal.movil

        #Anexado a un vehiculo
        if terminal.movil is not None:
            anexar_vehiculo(terminal, movil, False)

        #cambio del registro
        terminal = cambiar_estado_terminal(terminal, state)

        #data = get_terminal_json(terminal)
        data = {}
        data = json.dumps(data, cls = DjangoJSONEncoder)

        return HttpResponse(data, content_type='application/json')


class ReasignarTerminal(View):

    def post(self, req):
        id_term = req.POST.get('id')
        new_movil = req.POST.get('movil')

        #GetTerminal
        terminal = Terminal.objects.get( pk = id_term )

        #GetVehiculo
        movil = Movil.objects.get( pk = new_movil )

        #Desvincular vehiculo existente
        if terminal.movil is not None:
            self.desvincular_vehiculo_existente(movil)

        terminal.movil = movil
        terminal.save()

        #Incluir vehiculo
        anexar_vehiculo(terminal, movil, True)

        #OUT
        data = {'terminales': _get_terminales()}
        data = json.dumps(data, cls=DjangoJSONEncoder)

        return HttpResponse(data, content_type='application/json')

    def desvincular_vehiculo_existente(self, vehiculo):
        historico_existente = HistorialCambioVehiculo.objects.filter(estado = True, vehiculo = vehiculo)

        for historico in historico_existente:
            historico.estado = False
            historico.save()

            terms = Terminal.objects.filter(vehiculo = historico.vehiculo)

            for t in terms:
                t.vehiculo = None
                t.save()


class Maintenance(View):

    def post(self, req):
        pass
        # id_term = req.POST.get('id')
        # state = EstadoTerminal.objects.get(pk = EstadoTerminal.MANTENCION)

        # term = Terminal.objects.get( pk = int(id_term))
        # movil = term.vehiculo

        # #Anexado a un vehiculo
        # if movil is not None:
        #     anexar_vehiculo(term, movil, False)

        # #cambio del registro
        # term = cambiar_estado_terminal(terminal, state)

        # data = {
        #     'id': term.id,
        #     'codigo': term.codigo,
        #     'vehiculo': {
        #         'id': '0',
        #         'codigo': 'No Vehiculo'
        #     },
        #     'estado': {
        #         'id': term.estado.id,
        #         'nombre': term.estado.nombre,
        #         'show_opt' : False
        #     }
        # }

        # data = json.dumps(data, cls=DjangoJSONEncoder)
        # return HttpResponse(data, content_type='application/json')


class ReturnMaintenance(View):

    def post(self, req):
        id_term = req.POST.get('id')
        state = EstadoTerminal.objects.get(pk = int(1))

        term = Terminal.objects.get( pk = int(id_term))
        term.estado = state
        term.save()

        histo = HistorialEstadoTerminal()
        histo.terminal = term
        histo.estado = term.estado
        histo.save()

        data = {
            'id': term.id,
            'codigo': term.codigo,
            'vehiculo': {
                'id': '0',
                'codigo': 'No Vehiculo'
            },
            'estado': {
                'id': term.estado.id,
                'nombre': term.estado.nombre,
                'show_opt' : True
            }
        }

        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class EditarTerminal(View):

    @transaction.atomic
    def post(self, req):
        id_term = int(req.POST.get('id'))
        new_code = req.POST.get('codigo')

        term = Terminal.objects.get( pk = id_term )
        term.codigo = new_code
        term.save()

        data = get_terminal_json(term)
        data = json.dumps(data, cls = DjangoJSONEncoder)

        return HttpResponse(data, content_type='application/json')


obtener_terminales = ObtenerTerminales.as_view()
crear_terminal = CrearTerminal.as_view()
remover_terminal = RemoverTerminal.as_view()
editar_terminal = EditarTerminal.as_view()
maintenance = Maintenance.as_view()
return_maintenance = ReturnMaintenance.as_view()
reasignar_terminal = ReasignarTerminal.as_view()
