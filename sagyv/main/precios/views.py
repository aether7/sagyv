import json
from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView
from main.models import Producto

class IndexView(TemplateView):
    template_name = "precios/index.html"
    
    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['lista_precios'] = Producto.objects.exclude(tipo_producto_id = 3).order_by('orden')
        context['lista_precios_garantias'] = Producto.objects.filter(tipo_producto_id = 3)
        return context

index = IndexView.as_view()
