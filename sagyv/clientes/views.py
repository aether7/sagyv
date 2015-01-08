#-*- coding: utf-8 -*-
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.views.generic import TemplateView,View
from django.http import HttpResponse, JsonResponse

from clientes.models import Cliente
from clientes.models import DescuentoCliente
from clientes.models import TipoDescuento
from bodega.models import Producto

class Index(TemplateView):
    template_name = "cliente/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(Index, self).get_context_data(*args, **kwargs)
        context["tipos_descuento"] = TipoDescuento.objects.all()
        context["situaciones_comerciales"] = DescuentoCliente.objects.order_by("id")
        context["situaciones_comerciales_select"] = DescuentoCliente.objects.all().order_by("id")
        context["productos"] = Producto.objects.get_productos_filtrados()

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


class ObtenerCliente(View, ClienteMixin):
    def get(self, request):
        id_cliente = request.GET.get('id')

        if id_cliente is None:
            clientes = Cliente.objects.order_by('id')
            data = []
            for cliente in clientes:
                data.append(self._get_cliente(cliente))
        else:
            cliente = Cliente.objects.get(pk = int(id_cliente))
            data = self._get_cliente(cliente)

        return JsonResponse(data, safe = False)


class CrearEditarCliente(View):
    def obtener_situacion_comercial(self, texto_situacion):
        if texto_situacion == "otro":
            cantidad = self.request.POST.get("cantidad")
            tipo = self.request.POST.get("tipo")
            producto_id = self.request.POST.get("producto")

            sc = crear_nueva_situacion(cantidad, tipo, producto_id)
        else:
            sc = DescuentoCliente.objects.get(pk = int(texto_situacion))

        return sc


class CrearCliente(View, ClienteMixin):
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

        if sit_comercial_id is not None:
            cliente.situacion_comercial = DescuentoCliente.objects.get(pk = int(sit_comercial_id))

        cliente.save()

        data = self._get_cliente(cliente)
        return JsonResponse(data, safe = False)


class ModificarCliente(CrearEditarCliente):

    @transaction.atomic
    def post(self,req):
        situacion_comercial = req.POST.get('situacion_comercial')
        sc = self.obtener_situacion_comercial(situacion_comercial)
        cliente = self.modificar_cliente(sc)

        dato = {
            "status": "ok",
            "nombre" : cliente.nombre,
            "giro": cliente.giro,
            "telefono": cliente.telefono,
            "direccion" : cliente.direccion,
            "id" : cliente.id,
            "situacion_comercial" : cliente.situacion_comercial.__unicode__()
        }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def modificar_cliente(self, situacion_comercial):
        id_cliente = self.request.POST.get('id_cliente')
        nombre = self.request.POST.get('nombre')
        giro = self.request.POST.get('giro')
        direccion = self.request.POST.get('direccion')
        telefono = self.request.POST.get('telefono')
        credito = self.request.POST.get('credito')
        dispensador = self.request.POST.get('dispensador')
        es_lipigas = self.request.POST.get('es_lipigas')
        es_propio = self.request.POST.get('es_propio')
        obs = self.request.POST.get('obs')

        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.direccion = direccion
        cliente.telefono = telefono
        cliente.observacion = obs
        cliente.situacion_comercial = situacion_comercial

        cliente.es_lipigas = (es_lipigas != "false") and True or False
        cliente.credito = (credito != "false") and True or False
        cliente.dispensador = (dispensador != "false") and True or False
        cliente.es_propio = (es_propio != 'false') and True or False

        cliente.save()

        return cliente


class EliminarCliente(View):

    @transaction.atomic
    def post(self,req):
        id_cliente = req.POST.get('id_cliente')
        cliente = Cliente.objects.get(pk = id_cliente)
        rut = cliente.rut
        cliente.delete()

        dato = {
            "status": "ok",
            "id": id_cliente,
            "rut":  rut
        }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class BuscarCliente(View):

    def get(self, request):
        busqueda = request.GET.get("busqueda")
        opcion = request.GET.get("opcion")

        clientes = Cliente.objects.busqueda_por_campo(busqueda, opcion)
        data = []

        for cliente in clientes:
            data.append({
                "id" : cliente.id,
                "nombre" : cliente.nombre,
                "giro" : cliente.giro,
                "rut" : cliente.rut,
                "telefono" : cliente.telefono,
                "direccion" : cliente.direccion,
                "situacion_comercial" : cliente.situacion_comercial.__unicode__()
            })

        return HttpResponse(json.dumps(data), content_type="application/json")


class BuscarProducto(View):
    def get(self, req):
        producto_id = int(req.GET.get("producto_id"))
        producto = Producto.objects.get(pk = producto_id)

        data = json.dumps({
            "id": producto.id,
            "nombre": producto.nombre,
            "tipo": producto.tipo_producto.nombre
        })

        return HttpResponse(data, content_type="application/json")

index = Index.as_view()
obtener_cliente = ObtenerCliente.as_view()
crear_cliente = CrearCliente.as_view()
modificar_cliente = ModificarCliente.as_view()
eliminar_cliente = EliminarCliente.as_view()
buscar_cliente = BuscarCliente.as_view()
buscar_producto = BuscarProducto.as_view()
