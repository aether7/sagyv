#-*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder

from main.models import Terminal
from main.models import Vehiculo
from main.models import EstadoTerminal
from main.models import HistorialCambioVehiculo
from main.models import HistorialEstadoTerminal

def _get_terminales():
    terminales = []
    state = EstadoTerminal.objects.get(pk = 3)
    rs = Terminal.objects.exclude(estado = state).order_by('-vehiculo')

    for terminal in rs:
        if terminal.vehiculo is None:
            id_vehiculo = "0"
            numero_vehiculo = "No Vehiculo"
        else:
            id_vehiculo = terminal.vehiculo.id
            numero_vehiculo = 'Movil '+str(terminal.vehiculo.numero)

        if terminal.estado.id == 2:
            show_opt = True
        else:
            show_opt = False

        terminales.append({
            'id': terminal.id,
            'codigo': terminal.codigo,
            'vehiculo': {
                'id': id_vehiculo,
                'codigo': numero_vehiculo
            },
            'estado': {
                'id': terminal.estado.id,
                'nombre': terminal.estado.nombre,
                'show_opt' : show_opt
            }
        })

    return terminales


class ObtenerTerminales(View):

    def get(self, req):
        data = {'terminales': _get_terminales()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class CrearTerminal(View):

    def post(self, req):
        numero = req.POST.get('numero')
        vehiculo_id = req.POST.get('vehiculo')

        obj_vehiculo = Vehiculo.objects.get(pk = int(vehiculo_id))
        estado_terminal = EstadoTerminal.objects.get(pk = int(1))

        terminal = self.crearTerminal(numero, obj_vehiculo, estado_terminal)
        historico = self.crearHistoricoVehiculo(terminal)
        state = self.crearHistoricoEstado(terminal)


        data = {'terminales': _get_terminales()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

    def crearTerminal(self, numero, vehiculo, estado):
        obj_terminal = Terminal()
        obj_terminal.codigo = numero
        obj_terminal.vehiculo = vehiculo
        obj_terminal.estado = estado

        obj_terminal.save()

        return obj_terminal

    def crearHistoricoVehiculo(self, obj_terminal):
        historico = HistorialCambioVehiculo()
        try:
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

        except HistorialCambioVehiculo.DoesNotExist:
            historico.terminal = obj_terminal
            historico.vehiculo = obj_terminal.vehiculo
            historico.estado = True
            historico.save()

        return historico


    def crearHistoricoEstado(self, obj_terminal):
        state = HistorialEstadoTerminal()
        state.terminal = obj_terminal
        state.estado = obj_terminal.estado
        state.save()
        return state

class ModificarTerminal(View):
    pass

class RemoverTerminal(View):

    def post(self, req):
        id_term = req.POST.get('id')
        state = EstadoTerminal.objects.get(pk = int(3))

        term = Terminal.objects.get( pk = int(id_term))
        movil = term.vehiculo


        #Anexado a un vehiculo
        if movil is not None:
            histvehiculo = HistorialCambioVehiculo()
            histvehiculo.terminal = term
            histvehiculo.vehiculo = movil
            histvehiculo.estado = False
            histvehiculo.save()

        #cambio del registro
        term.estado = state
        term.vehiculo = None
        term.save()

        #historial terminal

        histo = HistorialEstadoTerminal()
        histo.terminal = term
        histo.estado = term.estado
        histo.save()


        data = {'status':'ok'}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class ReasignarTerminal(View):

    def post(self, req):
        id_term = req.POST.get('id')
        new_movil = req.POST.get('vehiculo')

        #GetTerminal
        terminal = Terminal.objects.get( pk = id_term )

        #GetVehiculo
        vehiculo = Vehiculo.objects.get( pk = new_movil )

        #Desvincular vehiculo existente
        if terminal.vehiculo is not None:
            historico_existente = HistorialCambioVehiculo.objects.filter(estado = True, vehiculo = vehiculo)

            for hist in historico_existente:
                print hist.terminal
                hist.estado = False
                hist.save()

                terms = Terminal.objects.filter(vehiculo = hist.vehiculo)
                for t in terms:
                    print t.vehiculo
                    t.vehiculo = None
                    t.save()

        else:
            try:
                historico_existente = HistorialCambioVehiculo.objects.filter(estado = True, vehiculo = vehiculo)

                for hist in historico_existente:
                    print hist.terminal
                    hist.estado = False
                    hist.save()

                    terms = Terminal.objects.filter(vehiculo = hist.vehiculo)
                    for t in terms:
                        print t.vehiculo
                        t.vehiculo = None
                        t.save()

            except HistorialCambioVehiculo.DoesNotExist:
                pass


        terminal.vehiculo = vehiculo
        terminal.save()

        #Incluir vehiculo
        histvehiculo = HistorialCambioVehiculo()
        histvehiculo.terminal = terminal
        histvehiculo.vehiculo = vehiculo
        histvehiculo.estado = True
        histvehiculo.save()

        #OUT
        data = {'terminales': _get_terminales()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class Maintenance(View):

    def post(self, req):
        id_term = req.POST.get('id')
        state = EstadoTerminal.objects.get(pk = int(2))

        term = Terminal.objects.get( pk = int(id_term))
        movil = term.vehiculo


        #Anexado a un vehiculo
        if movil is not None:
            histvehiculo = HistorialCambioVehiculo()
            histvehiculo.terminal = term
            histvehiculo.vehiculo = movil
            histvehiculo.estado = False
            histvehiculo.save()

        #cambio del registro
        term.estado = state
        term.vehiculo = None
        term.save()

        #historial terminal

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
                'nombre': term.estado.nombre
            }
        }
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


obtener_terminales = ObtenerTerminales.as_view()
crear_terminal = CrearTerminal.as_view()
remover_terminal = RemoverTerminal.as_view()
maintenance = Maintenance.as_view()
reasignar_terminal = ReasignarTerminal.as_view()
