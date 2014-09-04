#-*- coding: utf-8 -*-

import json
from django.http import HttpResponse
from django.views.generic import TemplateView,View
from main.models import Trabajador, Producto, Vehiculo, StockVehiculo
from main.models import GuiaDespacho, HistorialStock, Cliente
from main.models import TarjetaCredito, Producto, GuiaDespacho


class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["vehiculos"] = Vehiculo.objects.order_by("id")
        context["clientes"] = Cliente.objects.order_by("nombre")
        context["tarjetas_comerciales"] = TarjetaCredito.objects.get_tarjetas_comerciales()
        context["tarjetas_bancarias"] = TarjetaCredito.objects.get_tarjetas_bancarias()
        context["productos"] = Producto.objects.exclude(tipo_producto_id = 3)

        return context


class ObtenerGuiaDespacho(View):
    def get(self, req):
        id_vehiculo = int(req.GET.get("id_vehiculo"))
        vehiculo = Vehiculo.objects.get(pk = id_vehiculo)
        productos = self.obtener_productos(id_vehiculo)
        guia = GuiaDespacho.objects.filter(vehiculo = vehiculo).order_by("-id")[0]

        datos = {
            "vehiculo" : {
                "id" : id_vehiculo,
                "km" : vehiculo.km,
                "chofer" : vehiculo.get_nombre_ultimo_chofer()
            },
            "guia": {
                "numero" : guia.numero,
                "id" : guia.id
            },
            "productos" : productos
        }

        return HttpResponse(json.dumps(datos), content_type="application/json")

    def obtener_productos(self, id_vehiculo):
        lote = StockVehiculo.objects.filter(vehiculo_id = id_vehiculo)
        productos = []

        for item in lote:
            productos.append({
                'id': item.producto.id,
                'codigo': item.producto.codigo,
                'cantidad': item.cantidad,
                'precio': item.producto.get_precio_producto()
            })

        return productos


class BuscarCliente(View):
    def get(self, req):
        id_cliente = int(req.GET.get("id_cliente"))
        cliente = Cliente.objects.get(pk = id_cliente)

        data = {
            "id" : cliente.id,
            "direccion" : cliente.direccion,
            "rut" : cliente.rut,
            "situacion_comercial" : {
                "texto" : cliente.situacion_comercial.get_json_string(),
                "con_credito" : cliente.credito,
                "descripcion_descuento" : None,
                "simbolo" : None,
                "monto" : None
            }
        }

        opciones = self.get_situacion_comercial(cliente)
        data["situacion_comercial"]["descripcion_descuento"] = opciones["descripcion_descuento"]
        data["situacion_comercial"]["simbolo"] = opciones["simbolo"]
        data["situacion_comercial"]["monto"] = opciones["monto"]

        return HttpResponse(json.dumps(data), content_type="application/json")


    def get_situacion_comercial(self, cliente):
        opciones = {}
        params = None
        simbolo = None
        monto = str(cliente.situacion_comercial.monto_descuento)
        texto = ""

        if cliente.situacion_comercial.id == 1:
            texto = "Sin descuento"
        else:
            if cliente.situacion_comercial.tipo_descuento_id == 1:
                simbolo = "$"
                params = [simbolo, monto]
            else:
                simbolo = "%"
                params = [monto, simbolo]

            if cliente.credito:
                texto = "El cliente posee crédito y se descuenta {0} {1} de la compra total"
            else:
                texto = "El cliente posee {0} {1} en ({2})"
                opciones["codigo"] = cliente.situacion_comercial.producto.codigo
                params.append(opciones["codigo"])

            for i in range(len(params)):
                param = params[i]
                texto = texto.replace("{" + str(i) + "}", str(param))

        opciones["descripcion_descuento"] = texto
        opciones["simbolo"] = simbolo
        opciones["monto"] = monto

        return opciones


class BalanceLiquidacionView(View):
    def post(self, req):
        guia_despacho = req.POST.get('guia_despacho')
        id_trabajador = req.POST.get('id_trabajador')
        productos_json = req.POST.get('productos')
        productos = json.loads(productos_json)
        valor_total = 0

        for obj in productos:
            producto = Producto.objects.get(pk = obj["id"])
            precio = producto.get_precio_producto()
            valor_tmp = precio * int(obj["cantidad"])
            valor_total += valor_tmp

        dato = { 'valor': valor_total }

        return HttpResponse(json.dumps(dato), content_type="application/json")


index = IndexView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
balance_liquidacion = BalanceLiquidacionView.as_view()
buscar_cliente = BuscarCliente.as_view()
