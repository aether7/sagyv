import json
from django.db import transaction
from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Cliente, DescuentoCliente, TipoDescuento, Producto

class IndexView(TemplateView):
    template_name = "cliente/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["clientes"] = Cliente.objects.all()
        context["tipos_descuento"] = TipoDescuento.objects.all()
        context["situaciones_comerciales"] = DescuentoCliente.objects.all()
        context["productos"] = Producto.objects.all().order_by("id")

        return context


class ObtenerClienteView(View):

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
            'credito' : cliente.credito
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


class CrearClienteView(View):

    @transaction.commit_on_success
    def post(self, req):
        nombre = req.POST.get('nombre')
        giro = req.POST.get('giro')
        direccion = req.POST.get('direccion')
        telefono = req.POST.get('telefono')
        rut = req.POST.get('rut')
        situacion_comercial = req.POST.get('situacion_comercial')
        credito = req.POST.get('credito')

        rut = rut.replace('.', '');

        if situacion_comercial == "otro":
            cantidad = req.POST.get("cantidad")
            tipo = req.POST.get("tipo")
            situacion_comercial = self.crear_nueva_situacion(cantidad, tipo)

        if self.validar_cliente(rut):
            if situacion_comercial != '':
                sc = DescuentoCliente.objects.get(pk = situacion_comercial)

            cliente = Cliente()
            cliente.nombre = nombre
            cliente.giro = giro
            cliente.direccion = direccion
            cliente.telefono = telefono
            cliente.rut = rut
            cliente.situacion_comercial = sc
            if credito != "" and credito != "0" and credito != "false":
                cliente.credito = True
            else:
                cliente.credito = False

            cliente.save()

            dato = {
                "status": "ok",
                "id" : cliente.id,
                "nombre" : cliente.nombre,
                "giro" : cliente.giro,
                "rut" : cliente.rut,
                "situacion_comercial_text" : str(sc.monto_descuento)+' '+sc.tipo_descuento.tipo,
                "telefono" : cliente.telefono,
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
        nombre = req.POST.get('nombre')
        giro = req.POST.get('giro')
        direccion = req.POST.get('direccion')
        telefono = req.POST.get('telefono')
        situacion_comercial = req.POST.get('situacion_comercial')
        credito = req.POST.get('credito')

        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.nombre = nombre
        cliente.giro = giro
        cliente.direccion = direccion
        cliente.telefono = telefono

        if( cliente.situacion_comercial.id != situacion_comercial ):
            sc = DescuentoCliente.objects.get(pk = situacion_comercial)
            cliente.situacion_comercial = sc

        if credito != "" and credito != "0" and credito != "false":
            cliente.credito = True
        else:
            cliente.credito = False

        cliente.save()

        dato = {
            "status": "ok",
            "nombre" : cliente.nombre,
            "giro": cliente.giro,
            "telefono": cliente.telefono,
            "situacion_comercial" : str(sc.monto_descuento)+' '+sc.tipo_descuento.tipo
        }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class EliminarClienteView(View):

    @transaction.commit_on_success
    def post(self,req):
        id_cliente = req.POST.get('id_cliente')
        cliente = Cliente.objects.get(pk = id_cliente)
        cliente.delete()

        dato = { "status": "ok" }
        return HttpResponse(json.dumps(dato), content_type="application/json")


class ObtenerSituacionComercialView(View):

    def get(self, req, id_situacion):
        sc = DescuentoCliente.objects.get(pk = id_situacion)
        dato = {
            'id': sc.id,
            'monto_descuento': sc.monto_descuento,
            'tipo_descuento': sc.tipo_descuento.id
        }
        return HttpResponse(json.dumps(dato),content_type="application/json")


class CrearSituacionComercialView(View):
    @transaction.commit_on_success
    def post(self, req):
        tipo = req.POST.get('tipo')
        valor = req.POST.get('valor')
        producto_id = req.POST.get("producto")

        td = TipoDescuento.objects.get(pk = tipo)
        producto = Producto.objects.get(pk = producto_id)

        descuento_cliente = DescuentoCliente()
        descuento_cliente.tipo_descuento = td
        descuento_cliente.monto_descuento = valor
        descuento_cliente.producto = producto
        descuento_cliente.save()

        dato = {
            "status" : "ok",
            "id_situacion" : descuento_cliente.id,
            "valor" : descuento_cliente.monto_descuento,
            "tipo_descuento" : {
                "id" : td.id,
                "tipo" : td.tipo
            },
            "producto" : {
                "id" : producto.id,
                "nombre" : producto.nombre,
                "codigo" : producto.codigo,
                "nombre_tipo_producto" : producto.tipo_producto.nombre
            }
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")

class ModificarSituacionComercialView(View):
    @transaction.commit_on_success
    def post(self, req):
        id_situacion = req.POST.get('id_situacion')
        monto_nuevo = req.POST.get('valor')
        tipo = req.POST.get('tipo')

        descuento_cliente = DescuentoCliente.objects.get(pk = id_situacion)

        if(tipo != descuento_cliente.tipo_descuento.id):
            td = TipoDescuento.objects.get(pk = tipo)
            descuento_cliente.tipo_descuento = td

        descuento_cliente.monto_descuento = monto_nuevo
        descuento_cliente.save()

        dato = {
            "status": "ok",
            'id_situacion' : descuento_cliente.id,
            'valor': descuento_cliente.monto_descuento,
            'tipo':descuento_cliente.tipo_descuento.tipo,
            'tipo_int': descuento_cliente.tipo_descuento.id
        }

        return HttpResponse(json.dumps(dato),content_type="application/json")


index = IndexView.as_view()
obtener_cliente = ObtenerClienteView.as_view()
crear_cliente = CrearClienteView.as_view()
modificar_cliente = ModificarClienteView.as_view()
eliminar_cliente = EliminarClienteView.as_view()

obtener_situacion_comercial = ObtenerSituacionComercialView.as_view()
crear_situacion_comercial = CrearSituacionComercialView.as_view()
modificar_situacion_comercial = ModificarSituacionComercialView.as_view()
