from django.http import HttpResponse
from django.views.generic import TemplateView


index = TemplateView.as_view(template_name="reportes/index")
