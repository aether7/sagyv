from django.http import HttpResponse
from django.template import RequestContext
from django.views.generic import TemplateView
from main.managers import ReportesManager
from django.shortcuts import render

class ConsumoClientes(TemplateView):
    template_name = "reportes/consumo_clientes.html"

    def post(self, req):
        pass

    def get_context_data(self, *args, **kwargs):
        data = super(ConsumoClientes, self).get_context_data(*args, **kwargs)
        reportes = ReportesManager()
        rs = reportes.get_consumos_cliente_producto()
        data['productos'] = rs

        return data


class ComprasGas(TemplateView):
    template_name = "reportes/compras_gas.html"

    def post(self, req):
        pass


class KilosVendidos(TemplateView):
    template_name = "reportes/kilos_vendidos.html"

    def get(self, req):
        trabajadores = ReportesManager().get_kilos_vendidos_trabajor()
        data = { "trabajadores": trabajadores }
        return render(req, self.template_name, context_instance = RequestContext(req))


class Creditos(TemplateView):
    template_name = "reportes/creditos.html"

    def get(self, req):
        creditos = ReportesManager.detalle_cuotas_creditos()
        data = { "creditos": creditos }
        return render(req, self.template_name, context_instance = RequestContext(req))


class VentaMasa(TemplateView):
    template_name = "reportes/venta_masa.html"


index = TemplateView.as_view(template_name="reportes/index.html")
consumo_clientes = ConsumoClientes.as_view()
compras_gas = ComprasGas.as_view()
kilos_vendidos = KilosVendidos.as_view()
creditos = Creditos.as_view()
venta_masa = VentaMasa.as_view()
