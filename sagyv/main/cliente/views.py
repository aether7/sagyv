#-*- coding: utf-8 -*-

import json
from django.db import transaction
from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Cliente, DescuentoCliente, TipoDescuento, Producto

def crear_nueva_situacion(cantidad, tipo_id, producto_id):
    descuento_tipo = TipoDescuento.objects.get(pk = int(tipo_id))
    producto = Producto.objects.get(pk = int(producto_id))

    descuento_cliente = DescuentoCliente()
    descuento_cliente.monto_descuento = cantidad
    descuento_cliente.tipo_descuento = descuento_tipo
    descuento_cliente.producto = producto
    descuento_cliente.save()

    return descuento_cliente.id


class Index(TemplateView):
    template_name = "cliente/index.html"

    def get_context_data(self, *args, **kwargs):
        context = super(Index, self).get_context_data(*args, **kwargs)

        context["clientes"] = Cliente.objects.all()
        context["tipos_descuento"] = TipoDescuento.objects.all()
        context["situaciones_comerciales"] = DescuentoCliente.objects.exclude(id=1).order_by("id")
        context["situaciones_comerciales_select"] = DescuentoCliente.objects.all().order_by("id")
        context["productos"] = Producto.objects.exclude(tipo_producto_id=3).order_by("id")

        return context


class ObtenerCliente(View):

    def get(self, req, id_cliente):
        cliente = Cliente.objects.get(pk = id_cliente)

        dato = {
            'id' : cliente.id,
            'nombre' : cliente.nombre,
            'giro' : cliente.giro,
            'direccion' : cliente.direccion,
            'telefono' : cliente.telefono,
            'rut' : cliente.rut,
            'situacion_comercial' : cliente.situacion_comercial.id,
            'credito' : cliente.credito,
            'dispensador' : cliente.dispensador,
            'obs' : cliente.observacion
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class CrearCliente(View):

    @transaction.commit_on_success
    def post(self, req):
        situacion_comercial = req.POST.get('situacion_comercial')
        rut = req.POST.get('rut')

        self.rut = rut.replace('.', '')

        if not self.validar_cliente(rut):
            dato = { "status": "error", "status_message": "El cliente ya existe." }
            return HttpResponse(json.dumps(dato), content_type="application/json")

        sc = self.obtener_situacion_comercial(situacion_comercial)
        cliente = self.crear_cliente(sc)

        dato = {
            "status": "ok",
            "id" : cliente.id,
            "nombre" : cliente.nombre,
            "giro" : cliente.giro,
            "rut" : cliente.rut,
            "telefono" : cliente.telefono,
            "direccion" : cliente.direccion,
            "situacion_comercial" : {
                "id" : sc.id,
                "tipo" : sc.tipo_descuento.tipo,
                "texto" : sc.__unicode__()
            }
        }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def validar_cliente(self, dni):
        existe = True

        try:
            cliente_existe = Cliente.objects.get(rut = dni)
            existe = False
        except Cliente.DoesNotExist:
            existe = True

        return existe

    def obtener_situacion_comercial(self, situacion_comercial):
        if situacion_comercial == "otro":
            cantidad = self.request.POST.get("cantidad")
            tipo = self.request.POST.get("tipo")
            producto_id = self.request.POST.get("producto")

            situacion_comercial = crear_nueva_situacion(cantidad, tipo, producto_id)

        #revisar por si acaso, mas adelante
        if situacion_comercial != '':
            sc = DescuentoCliente.objects.get(pk = situacion_comercial)

        return sc

    def crear_cliente(self, situacion_comercial):
        nombre = self.request.POST.get('nombre')
        giro = self.request.POST.get('giro')
        direccion = self.request.POST.get('direccion')
        telefono = self.request.POST.get('telefono')
        credito = self.request.POST.get('credito')
        dispensador = self.request.POST.get("dispensador")
        obs = self.request.POST.get('obs')

        cliente = Cliente()
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.direccion = direccion
        cliente.telefono = telefono
        cliente.rut = self.rut
        cliente.situacion_comercial = situacion_comercial
        cliente.observacion = obs

        cliente.credito = (credito != "false") and True or False
        cliente.dispensador = (dispensador != "false") and True or False

        cliente.save()

        return cliente


class ModificarCliente(View):

    @transaction.commit_on_success
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

    def obtener_situacion_comercial(self, situacion_comercial):
        if situacion_comercial == "otro":
            cantidad = self.request.POST.get("cantidad")
            tipo = self.request.POST.get("tipo")
            producto_id = self.request.POST.get("producto")

            situacion_comercial = crear_nueva_situacion(cantidad, tipo, producto_id)

        #revisar por si acaso, mas adelante
        if situacion_comercial != '':
            sc = DescuentoCliente.objects.get(pk = situacion_comercial)

        return sc

    def modificar_cliente(self, situacion_comercial):
        id_cliente = self.request.POST.get('id_cliente')
        nombre = self.request.POST.get('nombre')
        giro = self.request.POST.get('giro')
        direccion = self.request.POST.get('direccion')
        telefono = self.request.POST.get('telefono')
        credito = self.request.POST.get('credito')
        dispensador = self.request.POST.get('dispensador')
        obs = self.request.POST.get('obs')

        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.direccion = direccion
        cliente.telefono = telefono
        cliente.observacion = obs
        cliente.situacion_comercial = situacion_comercial

        cliente.credito = (credito != "false") and True or False
        cliente.dispensador = (dispensador != "false") and True or False
        cliente.save()

        return cliente


class EliminarCliente(View):

    @transaction.commit_on_success
    def post(self,req):
        id_cliente = req.POST.get('id_cliente')
        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.delete()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class ObtenerSituacionComercial(View):

    def get(self, req, id_situacion):
        sc = DescuentoCliente.objects.get(pk = id_situacion)
        dato = {
            'id': sc.id,
            'monto_descuento': sc.monto_descuento,
            'tipo_descuento': sc.tipo_descuento.id,
            "formato_descuento" : sc.producto.id
        }
        return HttpResponse(json.dumps(dato),content_type="application/json")


class CrearSituacionComercial(View):

    @transaction.commit_on_success
    def post(self, req):
        descuento_cliente = self.crear_nueva_situacion()

        dato = {
            "status" : "ok",
            "id_situacion" : descuento_cliente.id,
            "valor" : descuento_cliente.monto_descuento,
            "valor_descripcion" : descuento_cliente.__unicode__(),
            "tipo_descuento" : {
                "id" : descuento_cliente.tipo_descuento.id,
                "tipo" : descuento_cliente.tipo_descuento.tipo
            },
            "producto" : {
                "id" : descuento_client.producto.id,
                "nombre" : descuento_client.producto.nombre,
                "codigo" : descuento_client.producto.codigo,
                "nombre_tipo_producto" : descuento_client.producto.tipo_producto.nombre
            }
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")

    def crear_nueva_situacion(self):
        tipo = self.request.POST.get('tipo')
        valor = self.request.POST.get('valor')
        producto_id = self.request.POST.get("producto")

        td = TipoDescuento.objects.get(pk = tipo)
        producto = Producto.objects.get(pk = producto_id)

        descuento_cliente = DescuentoCliente()
        descuento_cliente.tipo_descuento = td
        descuento_cliente.monto_descuento = valor
        descuento_cliente.producto = producto
        descuento_cliente.save()

        return descuento_cliente


class ModificarSituacionComercialView(View):

    @transaction.commit_on_success
    def post(self, req):
        id_situacion = req.POST.get('id_situacion')
        monto_nuevo = req.POST.get('valor')
        producto_id = req.POST.get('producto_id')
        tipo = req.POST.get('tipo')

        descuento_cliente = DescuentoCliente.objects.get(pk = id_situacion)

        if(tipo != descuento_cliente.tipo_descuento.id):
            td = TipoDescuento.objects.get(pk = tipo)
            descuento_cliente.tipo_descuento = td

        if(producto_id != descuento_cliente.producto.id):
            prod = Producto.objects.get(pk = producto_id)
            descuento_cliente.producto = prod

        descuento_cliente.monto_descuento = monto_nuevo
        descuento_cliente.save()

        dato = {
            "status" : "ok",
            "id_situacion" : descuento_cliente.id,
            "valor" : descuento_cliente.monto_descuento,
            "valor_descripcion" : descuento_cliente.__unicode__(),
            "tipo_descuento" : {
                "id" : td.id,
                "tipo" : td.tipo
            },
            "producto" : {
                "id" : prod.id,
                "nombre" : prod.nombre,
                "codigo" : prod.codigo,
                "nombre_tipo_producto" : prod.tipo_producto.nombre
            }
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class BuscarCliente(View):

    def get(self, request):
        busqueda = request.GET.get("busqueda")
        clientes = Cliente.objects.busqueda_por_campo(busqueda)
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


index = Index.as_view()
obtener_cliente = ObtenerCliente.as_view()
crear_cliente = CrearCliente.as_view()
modificar_cliente = ModificarClienteView.as_view()
eliminar_cliente = EliminarCliente.as_view()
buscar_cliente = BuscarCliente.as_view()

obtener_situacion_comercial = ObtenerSituacionComercial.as_view()
crear_situacion_comercial = CrearSituacionComercial.as_view()
modificar_situacion_comercial = ModificarSituacionComercialView.as_view()
