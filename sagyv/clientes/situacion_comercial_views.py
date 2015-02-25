# -*- coding: utf-8 -*-
import json
from django.http import JsonResponse
from django.db import transaction
from django.views.generic import View

from utils.views import LoginRequiredMixin

from bodega.models import Producto
from .models import DescuentoCliente
from .models import TipoDescuento


class SituacionComercialMixin(object):
    def _get_situacion_comercial(self, sc):
        data = { 'id': sc.id, 'monto': 0, 'tipoDescuento': None, 'formato': None }

        if str(sc) != 'Sin descuento':
            data['monto'] = sc.monto_descuento

            data['tipoDescuento'] = {
                'id': sc.tipo_descuento.id,
                'tipo': sc.tipo_descuento.tipo
            }

            data['producto'] = {
                'id': sc.producto.id,
                'codigo': sc.producto.codigo,
                'nombre': sc.producto.nombre
            }

        return data


class ObtenerSituacionComercial(LoginRequiredMixin, View, SituacionComercialMixin):
    def get(self, request):
        id_situacion = request.GET.get('id')

        if id_situacion is None:
            situaciones_comerciales = DescuentoCliente.objects.exclude(pk=1).order_by('id')
            data = []

            for sc in situaciones_comerciales:
                data.append(self._get_situacion_comercial(sc))
        else:
            sc = DescuentoCliente.objects.get(pk=int(id_situacion))
            data = self._get_situacion_comercial(sc)

        return JsonResponse(data, safe=False)


class CrearSituacionComercial(LoginRequiredMixin, View, SituacionComercialMixin):
    @transaction.atomic
    def post(self, request):
        monto = int(request.POST.get('monto'))
        producto_dict = json.loads(request.POST.get('producto'))
        tipo_dict = json.loads(request.POST.get('tipoDescuento'))

        producto = Producto.objects.get(pk=int(producto_dict['id']))
        tipo_descuento = TipoDescuento.objects.get(pk=int(tipo_dict['id']))

        descuento = DescuentoCliente()
        descuento.monto_descuento = monto
        descuento.producto = producto
        descuento.tipo_descuento = tipo_descuento
        descuento.save()

        data = self._get_situacion_comercial(descuento)
        return JsonResponse(data, safe=False)


class ModificarSituacionComercialView(LoginRequiredMixin, View, SituacionComercialMixin):
    @transaction.atomic
    def post(self, request):
        id_situacion = int(request.POST.get('id'))
        monto = int(request.POST.get('monto'))
        producto_dict = json.loads(request.POST.get('producto'))
        tipo_dict = json.loads(request.POST.get('tipoDescuento'))

        producto = Producto.objects.get(pk=int(producto_dict['id']))
        tipo_descuento = TipoDescuento.objects.get(pk=int(tipo_dict['id']))

        descuento = DescuentoCliente.objects.get(pk=id_situacion)
        descuento.monto_descuento = monto
        descuento.producto = producto
        descuento.tipo_descuento = tipo_descuento
        descuento.save()

        data = self._get_situacion_comercial(descuento)
        return JsonResponse(data, safe=False)


obtener_situacion_comercial = ObtenerSituacionComercial.as_view()
crear_situacion_comercial = CrearSituacionComercial.as_view()
modificar_situacion_comercial = ModificarSituacionComercialView.as_view()
