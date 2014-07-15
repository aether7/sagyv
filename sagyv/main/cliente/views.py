import json
from django.db import transaction
from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Cliente, DescuentoCliente, TipoDescuento

class IndexView(TemplateView):
    template_name = "cliente/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["clientes"] = Cliente.objects.all()
        context["tipos_descuento"] = TipoDescuento.objects.all()
        context["situaciones_comerciales"] = DescuentoCliente.objects.all()

        return context


class ObtenerClienteView(View):

    def get(self, req, id_cliente):
        cliente = Cliente.objects.get(pk = id_cliente)

        dato = {
            'id' : cliente.id,
            'giro' : cliente.giro,
            'direccion' : cliente.direccion,
            'telefono' : cliente.telefono,
            'rut' : cliente.rut,
            'situacion_comercial' : cliente.situacion_comercial.id,
            'credito' : cliente.credito
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class CrearClienteView(View):
    @transaction.commit_on_success
    def post(self, req):
        giro = req.POST.get('giro')
        direccion = req.POST.get('direccion')
        telefono = req.POST.get('telefono')
        rut = req.POST.get('rut')
        situacion_comercial = req.POST.get('situacion_comercial')
        credito = req.POST.get('credito')

        if situacion_comercial == "otro":
            cantidad = req.POST.get("cantidad")
            tipo = req.POST.get("tipo")
            situacion_comercial = self.crear_nueva_situacion(cantidad, tipo)

        if self.validar_cliente(rut):
            if situacion_comercial != '':
                sc = DescuentoCliente.objects.get(pk = situacion_comercial)

            cliente = Cliente()
            cliente.giro = giro
            cliente.direccion = direccion
            cliente.telefono = telefono
            cliente.rut = rut
            cliente.situacion_comercial = sc
            cliente.credito = credito != "" and True or False
            cliente.save()

            dato = {
                "status": "ok",
                "id" : cliente.id,
                "situacion_comercial" : {
                    "id" : sc.id,
                    "tipo" : sc.tipo_descuento.tipo
                }
            }
        else:
            dato = { "status": "error", "status_message": "El cliente ya existe." }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def crear_nueva_situacion(self, cantidad, tipo_id):
        descuento_tipo = TipoDescuento.objects.get(pk = int(tipo_id))

        descuento_cliente = DescuentoCliente()
        descuento_cliente.monto_descuento = cantidad
        descuento_cliente.tipo_descuento = descuento_tipo
        descuento_cliente.save()

        return descuento_cliente.id

    def validar_cliente(self, dni):
        existe = True

        try:
            cliente_existe = Cliente.objects.get(rut = dni)
            existe = False
        except Cliente.DoesNotExist:
            existe = True

        return existe


class ModificarClienteView(View):

    @transaction.commit_on_success
    def post(self,req):
        id_cliente = req.POST.get('id_cliente')
        giro = req.POST.get('giro')
        direccion = req.POST.get('direccion')
        telefono = req.POST.get('telefono')
        situacion_comercial = req.POST.get('situacion_comercial')
        credito = req.POST.get('credito')

        cliente = Cliente.objects.get(pk = id_cliente)

        if( cliente.giro != giro ):
            cliente.giro = giro

        if( cliente.direccion != direccion ):
            cliente.direccion = direccion

        if( cliente.telefono != telefono ):
            cliente.telefono = telefono

        if( cliente.situacion_comercial.id != situacion_comercial ):
            sc = DescuentoCliente.objects.get(pk = situacion_comercial)
            cliente.situacion_comercial = sc

        cliente.credito = credito != "" and True or False

        cliente.save()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class EliminarClienteView(View):

    @transaction.commit_on_success
    def post(self,req):
        id_cliente = req.POST.get('id_cliente')
        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.delete()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class CrearSituacionComercialView(View):

    def post(self, req):
        pass


index = IndexView.as_view()
obtener_cliente = ObtenerClienteView.as_view()
crear_cliente = CrearClienteView.as_view()
modificar_cliente = ModificarClienteView.as_view()
eliminar_cliente = EliminarClienteView.as_view()
crear_situacion_comercial = CrearSituacionComercialView.as_view()
