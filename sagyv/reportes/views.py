# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.template import RequestContext
from django.views.generic import TemplateView, View
from django.shortcuts import render

from reportes.managers import ReportesManager


class ConsumoClientes(View):
    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio')
        fecha_termino = req.GET.get('fechaTermino')
        consumos = ReportesManager().get_consumos_cliente_producto(fecha_inicio=fecha_inicio,
                                                                   fecha_termino=fecha_termino)
        data = []

        for consumo in consumos:
            data.append(consumo)

        return JsonResponse(data, safe=False)


class ComprasGas(View):
    def get(self, req):
        data = []
        return JsonResponse(data, safe=False)


class KilosVendidos(View):
    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio', None)
        fecha_termino = req.GET.get('fechaTermino', None)
        data = []
        return JsonResponse(data, safe=False)


class Creditos(TemplateView):
    template_name = "reportes/creditos.html"

    def get(self, req):
        fecha_inicio = req.GET.get('fechaInicio', None)
        fecha_termino = req.GET.get('fechaTermino', None)

        return render(req, self.template_name, context_instance=RequestContext(req))


class VentaMasa(TemplateView):
    template_name = "reportes/venta_masa.html"


index = TemplateView.as_view(template_name="reportes/index.html")

consumo_clientes = TemplateView.as_view(template_name="reportes/consumo_clientes.html")
obtener_consumo = ConsumoClientes.as_view()

compras_gas = TemplateView.as_view(template_name="reportes/compras_gas.html")
obtener_gas = ComprasGas.as_view()

kilos_vendidos = TemplateView.as_view(template_name="reportes/kilos_vendidos.html")
obtener_kilos_vendidos = KilosVendidos.as_view()

creditos = Creditos.as_view()
venta_masa = VentaMasa.as_view()
