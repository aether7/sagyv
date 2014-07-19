import json
from django.http import HttpResponse
from django.db import transaction
from django.views.generic import View, TemplateView, ListView
from main.models import Producto

class IndexList(ListView):
    model = Producto
    queryset = Producto.objects.exclude(orden=-1).order_by("orden")
    context_object_name = "productos"
    template_name = "precios/index.html"

index = IndexList.as_view()
