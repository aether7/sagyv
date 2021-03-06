# -*- coding: utf-8 -*-
from django.db import transaction
from django.views.generic import TemplateView,View
from django.http import JsonResponse
from utils.views import LoginRequiredMixin

from .models import Cliente
from .models import DescuentoCliente
from .models import TipoDescuento
from bodega.models import Producto


class Index(LoginRequiredMixin, TemplateView):
    template_name = 'cliente/index.html'

    def get_context_data(self, *args, **kwargs):
        context = super(Index, self).get_context_data(*args, **kwargs)
        context['tipos_descuento'] = TipoDescuento.objects.all()
        context['situaciones_comerciales'] = DescuentoCliente.objects.order_by('id')
        context['situaciones_comerciales_select'] = DescuentoCliente.objects.all().order_by('id')
        context['productos'] = Producto.objects.get_productos_filtrados()

        return context


class ClienteMixin(object):
    def _get_cliente(self, cliente):
        dato = {
            'id': cliente.id,
            'nombre': cliente.nombre,
            'giro': cliente.giro,
            'direccion': cliente.direccion,
            'telefono': cliente.telefono,
            'rut': cliente.rut,
            'credito': cliente.credito,
            'dispensador': cliente.dispensador,
            'lipigas': cliente.es_lipigas,
            'propio': cliente.es_propio,
            'observacion': cliente.observacion,
            'situacionComercial': None
        }

        if cliente.situacion_comercial is not None:
            sc = cliente.situacion_comercial
            dato['situacionComercial'] = {
                'id': sc.id,
                'monto': sc.monto_descuento,
                'tipoDescuento': {
                    'id': sc.tipo_descuento.id,
                    'tipo': sc.tipo_descuento.tipo
                },
                'producto': {
                    'id': sc.producto.id,
                    'codigo': sc.producto.codigo,
                    'nombre': sc.producto.nombre
                }
            }

        return dato


class ObtenerCliente(LoginRequiredMixin, View, ClienteMixin):
    def get(self, request):
        id_cliente = request.GET.get('id')

        if id_cliente is None:
            clientes = Cliente.objects.order_by('id')
            data = []
            for cliente in clientes:
                data.append(self._get_cliente(cliente))
        else:
            cliente = Cliente.objects.get(pk=int(id_cliente))
            data = self._get_cliente(cliente)

        return JsonResponse(data, safe=False)


class CrearCliente(LoginRequiredMixin, View, ClienteMixin):
    @transaction.atomic
    def post(self, request):
        nombre = request.POST.get('nombre')
        giro = request.POST.get('giro')
        rut = request.POST.get('rut')
        telefono = request.POST.get('telefono')
        direccion = request.POST.get('direccion')
        credito = request.POST.get('credito')
        dispensador = request.POST.get('dispensador')
        lipigas = request.POST.get('lipigas')
        propio = request.POST.get('propio')
        observacion = request.POST.get('observacion')
        sit_comercial_id = request.POST.get('situacionComercialId')

        cliente = Cliente()
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.rut = rut
        cliente.telefono = telefono
        cliente.direccion = direccion
        cliente.credito = credito
        cliente.dispensador = dispensador
        cliente.lipigas = lipigas
        cliente.propio = propio
        cliente.observacion = observacion

        if sit_comercial_id is not None and sit_comercial_id != 'null' and len(sit_comercial_id) != 0:
            cliente.situacion_comercial = DescuentoCliente.objects.get(pk=int(sit_comercial_id))

        cliente.save()

        data = self._get_cliente(cliente)
        return JsonResponse(data, safe=False)


class ModificarCliente(LoginRequiredMixin, View, ClienteMixin):
    @transaction.atomic
    def post(self, request):
        nombre = request.POST.get('nombre')
        giro = request.POST.get('giro')
        rut = request.POST.get('rut')
        telefono = request.POST.get('telefono')
        direccion = request.POST.get('direccion')
        credito = request.POST.get('credito')
        dispensador = request.POST.get('dispensador')
        lipigas = request.POST.get('lipigas')
        propio = request.POST.get('propio')
        observacion = request.POST.get('observacion')
        sit_comercial_id = request.POST.get('situacionComercialId')
        cliente_id = request.POST.get('id')

        cliente = Cliente.objects.get(pk=int(cliente_id))
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.rut = rut
        cliente.telefono = telefono
        cliente.direccion = direccion
        cliente.credito = credito
        cliente.dispensador = dispensador
        cliente.lipigas = lipigas
        cliente.propio = propio
        cliente.observacion = observacion

        #import pdb;pdb.set_trace();

        if sit_comercial_id is not None and sit_comercial_id != 'null' and sit_comercial_id != '':
            cliente.situacion_comercial = DescuentoCliente.objects.get(pk=int(sit_comercial_id))

        cliente.save()

        data = self._get_cliente(cliente)
        return JsonResponse(data, safe=False)


class EliminarCliente(LoginRequiredMixin, View):
    @transaction.atomic
    def post(self, request):
        id_cliente = request.POST.get('id')
        cliente = Cliente.objects.get(pk=int(id_cliente))
        cliente.delete()

        dato = {'status': 'ok'}
        return JsonResponse(dato, safe=False)


class BuscarCliente(LoginRequiredMixin, View, ClienteMixin):

    def get(self, request):
        busqueda = request.GET.get('busqueda')
        opcion = request.GET.get('opcion')

        clientes = Cliente.objects.busqueda_por_campo(busqueda, opcion)
        data = []

        for cliente in clientes:
            cliente_obj = self._get_cliente(cliente)
            data.append(cliente_obj)

        return JsonResponse(data, safe=False)


class ValidarRutCliente(LoginRequiredMixin, View):

    def get(self, request):
        rut = request.GET.get('rut')
        cantidad = Cliente.objects.filter(rut=rut).count()
        status = cantidad == 0

        data = {'status': status}
        return JsonResponse(data, safe=False)


index = Index.as_view()
obtener_cliente = ObtenerCliente.as_view()
crear_cliente = CrearCliente.as_view()
modificar_cliente = ModificarCliente.as_view()
eliminar_cliente = EliminarCliente.as_view()
buscar_cliente = BuscarCliente.as_view()
validar_cliente = ValidarRutCliente.as_view()
