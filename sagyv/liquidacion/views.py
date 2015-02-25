# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.views.generic import TemplateView, View
from django.db import transaction
from django.shortcuts import get_object_or_404

from main.helpers.fecha import convierte_texto_fecha
from utils.views import LoginRequiredMixin

from trabajador.models import BoletaTrabajador
from bodega.models import Producto
from bodega.models import GuiaDespacho
from bodega.models import HistorialStock
from bodega.models import StockVehiculo
from clientes.models import Cliente
from .models import Banco
from .models import Terminal
from .models import Cheque
from .models import CuponPrepago
from .models import Otros
from .models import TipoPago
from .models import Liquidacion
from .models import GuiaVenta
from .models import DetalleGuiaVenta
from .models import TransbankVoucher
from .models import LipigasVoucher
from .models import TarjetaCredito


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        context["clientes"] = Cliente.objects.order_by("id")
        context["clientes_propios"] = Cliente.objects.obtener_propios()
        context["clientes_lipigas"] = Cliente.objects.obtener_lipigas()
        context["tarjetas_comerciales"] = TarjetaCredito.objects.get_tarjetas_comerciales()
        context["bancos"] = Banco.objects.order_by("-cheques_recibidos")
        context["tarjetas_bancarias"] = TarjetaCredito.objects.get_tarjetas_bancarias()
        context["productos"] = Producto.objects.get_productos_filtrados()
        context["guias_despacho"] = GuiaDespacho.objects.filter(estado=0).order_by("id")
        context["terminales"] = Terminal.objects.get_activos()

        return context


class ObtenerGuiaDespacho(LoginRequiredMixin, View):
    def get(self, req):
        id_guia_despacho = int(req.GET.get("id_guia_despacho"))
        guia = get_object_or_404(GuiaDespacho,pk=id_guia_despacho)
        vehiculo = guia.movil.vehiculo
        boleta = BoletaTrabajador.objects.obtener_por_trabajador(vehiculo.get_ultimo_chofer())

        datos = {
            'vehiculo': self._obtener_vehiculo(vehiculo),
            'guia': self._obtener_guia(guia),
            'productos': self._obtener_productos(guia)
        }

        if boleta is None:
            datos["boleta"] = {
                "mensaje": "El trabajador no tiene una boleta asociada, por favor anexe una boleta antes de continuar"
            }
        else:
            datos['boleta'] = self._obtener_boleta(boleta)

        return JsonResponse(datos)

    def _obtener_productos(self, id_guia):
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

    def _obtener_vehiculo(self, vehiculo):
        data = {
            'id': vehiculo.id,
            'km': vehiculo.km,
            'chofer': vehiculo.get_nombre_ultimo_chofer()
        }

        return data

    def _obtener_guia(self, guia):
        data = {
            'id': guia.id,
            'numero': guia.numero,
            'fecha': guia.fecha
        }

        return data

    def _obtener_boleta(self, boleta):
        data = {
            'id': boleta.id,
            'boleta_inicial': boleta.boleta_inicial,
            'boleta_final': boleta.boleta_final,
            'actual': boleta.actual
        }

        return data


class BuscarCliente(LoginRequiredMixin, View):
    def get(self, req):
        id_cliente = int(req.GET.get("id_cliente"))
        cliente = Cliente.objects.get(pk=id_cliente)

        data = {
            "id": cliente.id,
            "direccion": cliente.direccion,
            "rut": cliente.rut,
            "situacion_comercial": {
                "texto": "",
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

        return JsonResponse(data, safe = False)

    def get_situacion_comercial(self, cliente):
        opciones = {}
        params = None
        simbolo = None
        texto = ""

        if cliente.situacion_comercial is None:
            texto = "Sin descuento"
            opciones["codigo"] = "Sin codigo"
            monto = None
        else:
            monto = str(cliente.situacion_comercial.monto_descuento)

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


class BalanceLiquidacionView(LoginRequiredMixin, View):
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
        return JsonResponse(dato, safe=False)


class Cerrar(LoginRequiredMixin, View):

    @transaction.atomic
    def post(self, req):
        self._descargar_vehiculo()
        self._procesar_liquidacion()
        self._procesar_guias()
        self._procesar_vouchers()
        self._ingreso_cupones()
        self._ingreso_cheques()
        self._ingreso_otros()

        # TODO se debe definir la respuesta del proceso entero
        dato = {'mensaje': 'El PDF se encuentra en proceso disculpe las molestias'}
        return JsonResponse(dato, safe=False)

    def _procesar_liquidacion(self):
        id_guia = self.request.POST.get('guia_despacho')
        nuevo_km = self.request.POST.get('kilometraje_ls')
        ultima_boleta = self.request.POST.get('numero_boleta_ls')

        this_guia = GuiaDespacho.objects.get(pk = int(id_guia))
        this_guia.estado = True
        this_guia.save()

        this_vehiculo = this_guia.movil.vehiculo
        this_vehiculo.km = int(nuevo_km)
        this_vehiculo.save()

        self.this_trabajador = this_vehiculo.get_ultimo_chofer()

        talonario_boleta = BoletaTrabajador.objects.get(trabajador = self.this_trabajador, activo=True)
        talonario_boleta.actual = int(ultima_boleta)
        talonario_boleta.save()

        self.this_liquidacion = Liquidacion()
        self.this_liquidacion.guia_despacho = this_guia
        self.this_liquidacion.save()

    def _procesar_vouchers(self):

        if len(self.request.POST.get('vouchers')) == 0:
            return

        vouchers = json.loads(self.request.POST.get('vouchers'))

        if len(vouchers['lipigas']):
            v_lipigas = vouchers['lipigas']
            self._ingreso_vouchers_lipigas(v_lipigas)

        if len(vouchers['transbank']):
            v_transbank = vouchers['transbank']
            self._ingreso_vouchers_transbank(v_transbank['tarjetas'])

    def _ingreso_vouchers_transbank(self, vouchers):
        for voucher in vouchers:
            tarjeta = TarjetaCredito.objects.get(pk=int(voucher['id']))

            transbank = TransbankVoucher()
            transbank.liquidacion = self.this_liquidacion
            transbank.tipo_tarjeta = tarjeta
            transbank.numero_operacion = int(voucher['num_operacion'])
            transbank.monto = int(voucher['monto'])
            transbank.save()

    def _ingreso_vouchers_lipigas(self, vouchers):
        terminal = Terminal.objects.get(pk=int(vouchers['terminal']))
        numero_cierre = int(vouchers['numero'])

        for voucher in vouchers['tarjetas']:
            tarjeta = TarjetaCredito.objects.get(pk=int(voucher['id']))

            lipigas = LipigasVoucher()
            lipigas.liquidacion = self.this_liquidacion
            lipigas.tipo_tarjeta = tarjeta
            lipigas.terminal = terminal
            lipigas.numero_cierre = numero_cierre
            lipigas.monto = int(voucher['monto'])
            lipigas.save()

            print lipigas

    def _descargar_vehiculo(self):
        id_guia = self.request.POST.get('guia_despacho')

        this_guia = GuiaDespacho.objects.get(pk=int(id_guia))
        stock_vehiculo = StockVehiculo.objects.filter(vehiculo=this_guia.movil.vehiculo)

        # se limpia el vehiculo.
        for sv in stock_vehiculo:
            sv.delete()

        # se extrae el json
        productos = json.loads(self.request.POST.get('productos'))

        for producto in productos:
            row = Producto.objects.get(pk=producto['id'])
            print row.stock
            print producto['llenos']
            row.stock += int(producto['llenos'])
            row.save()
            print "===="
            print row.stock
            print "****"
            cod_garantia = '31'+str(row.codigo)[2:]
            garantia = Producto.objects.get(codigo = cod_garantia)
            print garantia.stock
            print garantia.stock + int(producto['vacios'])
            garantia.stock += int(producto['vacios'])
            garantia.save()
            print "===="
            print garantia.stock
            # Se anexa a las garantias

    def _procesar_guias(self):
        guias = json.loads(self.request.POST.get('guias'))

        if len(guias['propias']) > 0:
            propias = json.loads(guias['propias'])
            self._ingreso_guias_propia(propias)

        if len(guias['lipigas']) > 0:
            lipigas = json.loads(guias['lipigas'])
            self._ingreso_guia_lipigas(lipigas)

    def _ingreso_cupones(self):
        tipo_pago = TipoPago.objects.get(pk=int(3))
        cupones = self.request.POST.get('cupones_prepago')

        if cupones == '':
            return

        cupones = json.loads(cupones)

        for i in cupones:
            client = Cliente.objects.get(pk=int(i['cliente']['id']))
            formato = Producto.objects.get(pk=int(i['formato']['id']))

            cupon = CuponPrepago()
            cupon.numero_cupon = i['numero']
            cupon.descuento = int(i['descuento'])
            cupon.liquidacion = self.this_liquidacion
            cupon.formato = formato
            cupon.cliente = client
            cupon.save()

    def _ingreso_cheques(self):
        cheques = self.request.POST.get('cheques')

        if cheques == '':
            return

        cheques = json.loads(cheques)

        for c in cheques:
            bank = Banco.objects.get(pk=int(c['banco']['id']) )
            bank.cheques_recibidos += 1
            bank.save()

            cheque = Cheque()

            cheque.monto = int(c["monto"])
            cheque.banco = bank
            cheque.liquidacion = self.this_liquidacion
            cheque.fecha = convierte_texto_fecha(c['fecha'])
            cheque.numero = c['numero']
            cheque.cobrado = False
            cheque.save()

    def _ingreso_otros(self):
        otros = self.request.POST.get('otros')

        if otros == '':
            return

        otros = json.loads(otros)

        for o in otros:
            otro = Otros()
            otro.concepto = o['concepto']
            otro.monto = o['monto']
            otro.trabajador = self.this_trabajador
            otro.liquidacion = self.this_liquidacion
            otro.save()

    def _ingreso_guias_propia(self, guias):
        for guia in guias:
            client = Cliente.objects.get(pk=int(guia['cliente']['id']))

            this = GuiaVenta()
            this.cliente = client
            this.propia = True
            this.liquidacion = self.this_liquidacion
            this.save()

            self._ingresar_productos_guia(guia['productos'], this)

    def _ingreso_guia_lipigas(self, guias):
        for guia in guias:
            client = Cliente.objects.get(pk=int(guia['cliente']['idCliente']))

            this = GuiaVenta()
            this.cliente = client
            this.propia = False
            this.liquidacion = self.this_liquidacion
            this.save()

            self._ingresar_productos_guia(guia['productos'], this)

    def _ingresar_productos_guia(self, productos, guia):
        for prod in productos:
            producto = Producto.objects.get(codigo=int(prod['codigo']))

            this = DetalleGuiaVenta()
            this.cantidad = int(prod['cantidad'])
            this.producto = producto
            this.guia_venta = guia
            this.save()


class ObtenerGarantias(LoginRequiredMixin, View):
    def get(self, req):
        garantias = Producto.objects.get_garantias_filtradas()
        data = []

        for garantia in garantias:
            item = {
                'id': garantia.id,
                'codigo': garantia.codigo,
                'precio': garantia.get_precio_producto()
            }

            data.append(item)

        return JsonResponse(data, safe=False)


index = IndexView.as_view()
obtener_guia = ObtenerGuiaDespacho.as_view()
obtener_garantias = ObtenerGarantias.as_view()
balance_liquidacion = BalanceLiquidacionView.as_view()
buscar_cliente = BuscarCliente.as_view()
cerrar = Cerrar.as_view()
