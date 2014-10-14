from django.http import HttpResponse
from django.views.generic import TemplateView
from main.managers import ReportesManager

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

index = TemplateView.as_view(template_name="reportes/index.html")
consumo_clientes = ConsumoClientes.as_view()
