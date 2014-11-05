#-*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder

from main.models import Terminal
from main.models import Vehiculo
from main.models import EstadoTerminal
from main.models import HistorialCambioVehiculo

class ObtenerTerminales(View):

    def get(self, req):
        data = { 'terminales': self._get_terminales() }
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

    def _get_terminales(self):
        terminales = []
        rs = Terminal.objects.all()

        for terminal in rs:
            terminales.append({
                'id': terminal.id,
                'codigo': terminal.codigo,
                'vehiculo': {
                    'id': terminal.vehiculo.id,
                    'codigo': terminal.vehiculo.numero
                },
                'estado': {
                    'id': terminal.estado.id,
                    'nombre': terminal.estado.nombre
                }
            })

        return terminales

class CrearTerminal(View):

    def post(self, req):
        print req.POST
        numero = req.POST.get('numero')
        vehiculo_id = req.POST.get('vehiculo')

        obj_vehiculo = Vehiculo.objects.get(pk = int(vehiculo_id))
        estado_terminal = EstadoTerminal.objects.get(pk = int(1))

        terminal = self.crearTerminal(numero, obj_vehiculo, estado_terminal)
        historico = self.CrearHistoricoVehiculo(terminal)


        data = {'Status': 'ok'}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

    def crearTerminal(self, numero, vehiculo, estado):
        obj_terminal = Terminal()
        obj_terminal.codigo = numero
        obj_terminal.vehiculo = vehiculo
        obj_terminal.estado = estado

        obj_terminal.save()

        return obj_terminal

    def CrearHistoricoVehiculo(self, obj_terminal):
        historico = HistorialCambioVehiculo()
        try:
            historico_existente = HistorialCambioVehiculo.objects.filter(estado = True, vehiculo = obj_terminal.vehiculo)
            for h in historico_existente:
                h.estado = False
                h.save()

                terminales = Terminal.objects.filter(vehiculo = h.vehiculo, terminal != obj_terminal)

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


    def CrearHistoricoEstado(self, obj_terminal):
        pass


obtener_terminales = ObtenerTerminales.as_view()
crear_terminal = CrearTerminal.as_view()
