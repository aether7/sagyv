from django.views.generic import TemplateView,View
from main.models import Trabajador

class IndexView(TemplateView):
    template_name = "liquidacion/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context["trabajadores"] = Trabajador.objects.all()

        return context

index = TemplateView.as_view(template_name="liquidacion/index.html")
