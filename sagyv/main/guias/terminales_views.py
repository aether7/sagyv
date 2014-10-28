#-*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder
from main.models import Terminal

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

obtener_terminales = ObtenerTerminales.as_view()
