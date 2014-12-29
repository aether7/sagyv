#-*- coding: utf-8 -*-
import json

from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View
from django.core.serializers.json import DjangoJSONEncoder

from main.models import GuiaTrabajador
from main.models import Trabajador
from main.models import GuiaVenta
from main.models import DetalleGuiaVenta

"""
Tengo duda si definirlo como Guia o Guias.
actualmente lo estoy definiendo como 'Guia'
"""

def get_guias(guias):
    data = {
        'id': guias.id,
        'inicial': guias.guia_inicial,
        'ultima': guias.guia_final,
        'actual': guias.actual,
        'trabajador': {
            'id': guias.trabajador.id,
            'nombre': guias.trabajador.get_nombre_completo()
        }
    }

    return data

def _get_guias():
    guias = []
    rs = GuiaTrabajador.objects.order_by("-fecha_creacion").exclude(activo = False)

    for guia in rs:
        data = get_guias(guia)
        guias.append(data)

    return guias

def _cambio_estado_guia_existente(trabajador):
    rs = GuiaTrabajador.objects.filter(trabajador = trabajador).exclude(activo = True)

    for guias in rs:
        guias.activo = False
        guias.save()


class ObtenerGuias(View):

    def get(self, req):
        data = _get_guias()
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class CrearGuias(View):

    @transaction.atomic
    def post(self, req):
        inicial = int(req.POST.get('inicial'))
        final = int(req.POST.get('ultima'))
        worker_obj = json.loads(req.POST.get('trabajador'))
        trabajador_id = int(worker_obj.get('id'))

        trabajador = Trabajador.objects.get( pk = trabajador_id )
        _cambio_estado_guia_existente(trabajador)
        self.crear_guias(inicial, final, trabajador)

        data = {'guias' : _get_guias()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

    def crear_guias(self, inicial, final, trabajador):
        nueva_guia = GuiaTrabajador()
        nueva_guia.guia_inicial = inicial
        nueva_guia.guia_final = final
        nueva_guia.actual = inicial
        nueva_guia.trabajador = trabajador
        nueva_guia.activo = True
        nueva_guia.save()


class EditarGuias(View):

    @transaction.atomic
    def post(self, req):
        guias_id = int(req.POST.get('id'))
        worker_obj = json.loads(req.POST.get('trabajador'))
        trabajador_id = int(worker_obj.get('id'))

        guias = GuiaTrabajador.objects.get( pk = guias_id )
        trabajador = Trabajador.objects.get( pk = trabajador_id )

        guias.trabajador = trabajador
        guias.save()

        data = {'guias' : _get_guias()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class EliminarGuias(View):

    @transaction.atomic
    def post(self, req):
        guias_id = int(req.POST.get('id'))

        guias = GuiaTrabajador.objects.get( pk = guias_id )
        guias.activo = False
        guias.save()

        data = {'guias' : _get_guias()}
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')


class NN(View):

    def get(self, req):
        """
        Respuesta del metodo:
        data = [
        {
            id : ,
            numero : ,
            cliente :{
                id :
                nombre:
            },
            fecha : ,
            precio_total: ,
            productos : [
                {
                    id :
                    precio :
                    codigo :
                    cantidad :
                },
                {},...
            ]
        }
        ,{},...
        ]
        """
        guias_id = int(req.GET.get('id'))

        guias_venta = GuiaVenta.objects.obtener_guias_rango(guias_id)

        data = self.procesar_guia(guias_venta)
        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type='application/json')

    def procesar_guia(guias_venta):
        guias = []
        for gv in guias_venta:
            guia = {
                'id' : gv.id,
                'numero' : gv.numero,
                'cliente' :{
                    'id' :gv.cliente.id,
                    'nombre' gv.cliente.nombre
                },
                'fecha': gv.liquidacion.fecha,
                'precio_total' : 'NONE~~',
                'productos' : self.procesar_productos(gv)
            }

            guias.append(guia)

        return guias

    def procesar_productos(guia):
        lista = []
        detalle = DetalleGuiaVenta.objects.filter( guia_venta = guia )

        for some in detalle:
            item = {
                'id': some.producto.id,
                'codigo': some.producto.codigo,
                'cantidad': some.cantidad,
                'precio': some.producto.get_precio_producto()
            }

            lista.append(item)

        return lista


obtener_guias = ObtenerGuias.as_view()
crear_guias = CrearGuias.as_view()
editar_guias = EditarGuias.as_view()
eliminar_guias = EliminarGuias.as_view()
