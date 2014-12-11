# -*- coding: utf-8 -*-
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.views.generic import TemplateView, View
from django.db import transaction

from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto

from main.managers import ReportesManager
from main.reportes import templates


from main.models import Banco
from main.models import BoletaTrabajador
from main.models import Cliente
from main.models import Trabajador
from main.models import TarjetaCredito
from main.models import Producto
from main.models import GuiaDespacho
from main.models import HistorialStock
from main.models import Terminal
from main.models import Cheque
from main.models import CuponPrepago
from main.models import Otros
from main.models import TipoPago

from main.models import Liquidacion
from main.models import GuiaVenta
from main.models import DetalleGuiaVenta


class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["clientes"] = Cliente.objects.order_by("id")
        context["clientes_propios"] = Cliente.objects.filter(es_propio=True).order_by("id")
        context["clientes_lipigas"] = Cliente.objects.filter(es_lipigas=True).order_by("id")
        context["tarjetas_comerciales"] = TarjetaCredito.objects.get_tarjetas_comerciales()
        context["bancos"] = Banco.objects.order_by("-cheques_recibidos")
        context["tarjetas_bancarias"] = TarjetaCredito.objects.get_tarjetas_bancarias()
        context["productos"] = Producto.objects.exclude(tipo_producto_id=3)
        context["guias_despacho"] = GuiaDespacho.objects.filter(estado = 0).order_by("id")
        context["terminales"] = Terminal.objects.order_by("id")

        return context


class ObtenerGuiaDespacho(View):
    def get(self, req):
        id_guia_despacho = int(req.GET.get("id_guia_despacho"))
        guia = GuiaDespacho.objects.get(pk=id_guia_despacho)
        vehiculo = guia.vehiculo
        productos = self.obtener_productos(guia)

        boleta = BoletaTrabajador.objects.obtener_por_trabajador(vehiculo.get_ultimo_chofer())

        datos = {
            "vehiculo": {
                "id": vehiculo.id,
                "km": vehiculo.km,
                "chofer": vehiculo.get_nombre_ultimo_chofer()
            },
            "guia": {
                "id": guia.id,
                "numero": guia.numero,
                "fecha": convierte_fecha_texto(guia.fecha)
            },
            "productos": productos
        }

        if boleta is None:
            datos["boleta"] = {
                "mensaje": "El trabajador no tiene una boleta asociada, por favor anexe una boleta antes de continuar"
            }
        else:
            datos["boleta"] = {
                "id": boleta.id,
                "boleta_inicial": boleta.boleta_inicial,
                "boleta_final": boleta.boleta_final,
                "actual": boleta.actual
            }

        datos = json.dumps(datos, cls=DjangoJSONEncoder)
        return HttpResponse(datos, content_type="application/json")

    def obtener_productos(self, id_guia):
        lote = HistorialStock.objects.get_productos_guia_total(id_guia)
        productos = []

        for item in lote:
            productos.append({
                'id': item.producto.id,
                'codigo': item.producto.codigo,
                'cantidad': item.cantidad,
                'precio': item.producto.get_precio_producto(),
                'peso': item.producto.peso
            })

        return productos


class BuscarCliente(View):
    def get(self, req):
        id_cliente = int(req.GET.get("id_cliente"))
        cliente = Cliente.objects.get(pk=id_cliente)

        data = {
            "id": cliente.id,
            "direccion": cliente.direccion,
            "rut": cliente.rut,
            "situacion_comercial": {
                "texto": cliente.situacion_comercial.get_json_string(),
                "con_credito": cliente.credito,
                "descripcion_descuento": None,
                "simbolo": None,
                "monto": None,
                "codigo": None
            }
        }

        opciones = self.get_situacion_comercial(cliente)
        data["situacion_comercial"]["descripcion_descuento"] = opciones["descripcion_descuento"]
        data["situacion_comercial"]["simbolo"] = opciones["simbolo"]
        data["situacion_comercial"]["monto"] = opciones["monto"]
        data["situacion_comercial"]["codigo"] = opciones["codigo"]

        data = json.dumps(data,cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type="application/json")


    def get_situacion_comercial(self, cliente):
        opciones = {}
        params = None
        simbolo = None
        monto = str(cliente.situacion_comercial.monto_descuento)
        texto = ""

        if cliente.situacion_comercial.id == 1:
            texto = "Sin descuento"
            opciones["codigo"] = "Sin codigo"
        else:
            if cliente.situacion_comercial.tipo_descuento_id == 1:
                simbolo = "$"
                params = [simbolo, monto]
            else:
                simbolo = "%"
                params = [monto, simbolo]

            opciones["codigo"] = cliente.situacion_comercial.producto.codigo

            if cliente.credito:
                texto = "El cliente posee crédito y se descuenta {0} {1} de la compra total"
            else:
                texto = "El cliente posee {0} {1} en ({2})"
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
            producto = Producto.objects.get(pk=obj["id"])
            precio = producto.get_precio_producto()
            valor_tmp = precio * int(obj["cantidad"])
            valor_total += valor_tmp

        dato = {'valor': valor_total}
        dato = json.dumps(dato, cls=DjangoJSONEncoder)

        return HttpResponse(dato, content_type="application/json")


class Cerrar(View):

    @transaction.atomic
    def post(self, req):
        """
        TODO :
            - Añadir al Json: nuevo_km.                     NOK
            - Añadir al Json: boleta_actual.                NOK
            - Cupones de prepago, añadir boleta.            NOK

        .- Retirar Elementos desde el vehiculo              ~OK
        .- Obtener chofer con la guia                       ~OK
        .- Llenar tabla Liquidacion                         ~OK
            - Llenar datos GuiaVenta                        NOK
            - Llenar datos DetalleGuiaVenta                 NOK
            PD : Solo en caso de guia propia/lipigas
        .- Actualizar datos
            - vehiculo                                      ~OK :: Falta dato desde Frontend
            - talonarios                                    ~OK :: Falta dato desde Frontend
            - Retirar Carga del vehiculo                    NOK
        .- Ingreso de cupones                               ~OK
        .- Ingreso de cheques                               ~OK
        .- Ingreso de voucher lipigas                       NOK
        .- Ingreso de voucher Transbank                     NOK
        .- Ingreso de Otros                                 NOK
        .- Guia Propia                                      NOK
            - añadir cliente                                NOK
        .- Guia Lipigas                                     NOK
            - añadir cliente                                NOK
        """
        json_guia = json.loads(req.POST.get('guia_despacho'))
        cupones_prepago = req.POST.get('cupones_prepago')
        otros = req.POST.get('otros')
        cheques = req.POST.get('cheques')
        guias = req.POST.get('guias')

        propias = guias['propias']
        lipigas = guias['lipigas']

        this_guia = GuiaDespacho.objects.get(pk = int(json_guia['id']))

        this_vehiculo = this_guia.vehiculo
        """
        this_vehiculo.km = nuevo_km
        this_vehiculo.save()
        """

        self.this_trabajador = this_vehiculo.get_ultimo_chofer()
        talonario_boleta = BoletaTrabajador.objects.get(trabajador = self.this_trabajador)
        """
        talonario_boleta.actual = boleta_actual
        talonario_boleta.save()
        """

        self.this_liquidacion = Liquidacion()
        this_liquidacion.guia_despacho = this_guia
        this_liquidacion.save()




        if cupones_prepago != '':
            self.ingreso_cupones(json.loads(cupones_prepago))

        if otros != '':
            self.ingreso_otros(json.loads(otros))

        if cheques != '':
            self.ingreso_cheques(json.loads(cheques))

        if propias != '':
            self.ingreso_guias_propia(json.loads(propias))

        if lipigas != '':
            self.ingreso_guia_lipigas(json.loads(lipigas))

        """
        Se debe definir la respuesta del proceso.
        """
        dato = {'status': 'WIP'}
        dato = json.dumps(dato, cls=DjangoJSONEncoder)

        return HttpResponse(dato, content_type="application/json")


    def ingreso_cupones(self, cupones):
        tipo_pago = TipoPago.objects.get(pk=int(3))

        for i in cupones:
            client = Cliente.objects.get( pk = int(i['cliente']['id']) )
            format = Producto.objects.get( pk = int(i['formato']['id']) )

            cupon = CuponPrepago()
            cupon.numero_cupon = i['numero']
            cupon.descuento = int(i['descuento'])
            cupon.liquidacion = self.this_liquidacion
            cupon.formato = format
            cupon.cliente = client
            cupon.save()

    def ingreso_vouchers(self, vouchers):
        pass

    def ingreso_cheques(self, cheques):
        for c in cheques:
            bank = Banco.objects.get( pk = int(c['banco']['id']) )
            bank.cheques_recibidos = 1 + bank.cheques_recibidos
            bank.save()

            cheque = Cheque()

            cheque.monto = int(c["monto"])
            cheque.banco = bank
            cheque.liquidacion = self.this_liquidacion
            cheque.fecha = convierte_texto_fecha(c['fecha'])
            cheque.numero = c['numero']
            cheque.cobrado = False
            cheque.save()

    def ingreso_otros(self, otros):
        for o in otros:
            otro = Otros()
            otro.concepto = o['concepto']
            otro.monto = o['monto']
            otro.trabajador = self.this_trabajador
            otro.liquidacion = self.this_liquidacion
            otro.save()

    def ingreso_guias_propia(self, guias):
        for guia in guias:
            client = Cliente.objects.get( pk = int(guia['cliente']['id']) )

            this = GuiaVenta()
            this.cliente = client
            this.propia = True
            this.liquidacion = self.this_liquidacion
            this.save()

            self.ingresar_productos_guia(guia['productos'], this)

    def ingreso_guia_lipigas(self, some):
        for guia in guias:
            client = Cliente.objects.get( pk = int(guia['cliente']['id']) )

            this = GuiaVenta()
            this.cliente = client
            this.propia = False
            this.liquidacion = self.this_liquidacion
            this.save()

            self.ingresar_productos_guia(guia['productos'], this)

    def ingresar_productos_guia(self, productos, guia):
        for prod in productos:
            producto = Producto.objects.get( codigo = int(prod['codigo']) )

            this = DetalleGuiaVenta()
            this.cantidad = int(prod['catidad'])
            this.producto = producto
            this.guia_venta = guia
            this.save()

    def ingreso_montos(self, montos):
        pass


index = IndexView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
balance_liquidacion = BalanceLiquidacionView.as_view()
buscar_cliente = BuscarCliente.as_view()
cerrar = Cerrar.as_view()
