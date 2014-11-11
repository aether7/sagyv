import json

from django.http import HttpResponse
from django.template import RequestContext
from django.views.generic import TemplateView, View
from main.managers import ReportesManager
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder

class ConsumoClientes(View):
    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio')
        fecha_termino = req.GET.get('fechaTermino')
        consumos = ReportesManager().get_consumos_cliente_producto(fecha_inicio, fecha_termino)
        data = []


        # lipigas / propio
        # nombre cliente
        # formato consumido normalmente
        # monto(descuento)

        # Si es un cliente credito, no mostrar monto
        # ingresar x cliente

        for consumo in consumos:
            data.append({
                "cliente": {
                    "id": consumo.id_cliente,
                    "nombre": consumo.nombre_cliente
                },
                "producto": {
                    "id": consumo.producto_id,
                    "codigo": consumo.producto_codigo,
                    "suma": consumo.suma_producto
                }
            })

        data = json.dumps(data, cls=DjangoJSONEncoder)
        return HttpResponse(data, content_type="application/json")


class ComprasGas(TemplateView):
    template_name = "reportes/compras_gas.html"

    def post(self, req):
        pass


class KilosVendidos(TemplateView):
    template_name = "reportes/kilos_vendidos.html"

    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio', None)
        fecha_termino = req.GET.get('fechaTermino', None)
        trabajadores = ReportesManager().get_kilos_vendidos_trabajor(fecha_inicio, fecha_termino)

        data = { "trabajadores": trabajadores }

        return render(req, self.template_name, context_instance = RequestContext(req))


class Creditos(TemplateView):
    template_name = "reportes/creditos.html"

    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio', None)
        fecha_termino = req.GET.get('fechaTermino', None)
        creditos = ReportesManager().detalle_cuotas_creditos(fecha_inicio, fecha_termino)

        data = { "creditos": creditos }

        return render(req, self.template_name, context_instance = RequestContext(req))


class VentaMasa(TemplateView):
    template_name = "reportes/venta_masa.html"


index = TemplateView.as_view(template_name="reportes/index.html")

consumo_clientes = TemplateView.as_view(template_name="reportes/consumo_clientes.html")
obtener_consumo = ConsumoClientes.as_view()

compras_gas = ComprasGas.as_view()
kilos_vendidos = KilosVendidos.as_view()
creditos = Creditos.as_view()
venta_masa = VentaMasa.as_view()
