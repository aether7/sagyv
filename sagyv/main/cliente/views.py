from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Cliente

class IndexView(TemplateView):
	template_name = "cliente/index.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context["clientes"] = Cliente.objects.all()
		return context

class ClienteExisteView(View):

    def post(self, req):
        rut = req.POST.get('rut')

        try:
            cliente_existe = Cliente.objects.get(rut = rut)
            dato = { "status": "error", "status_message": "El cliente ya existe." }
        except cliente_existe.DoesNotExist:
            dato = { "status": "ok" }

        return HttpResponse(json.dumps(dato), content_type="application/json");


class CrearClienteView(View):
	
    def post(self, req):
        giro = req.POST.get('')
        direccion = req.POST.get('')
        telefono = req.POST.get('')
        rut = req.POST.get('')
        situacion_comercial = req.POST.get('')
        credito = req.POST.get('')

        cliente = Cliente()
        cliente.giro = giro
        cliente.direccion = direccion
        cliente.telefono = telefono
        cliente.rut = rut
        cliente.situacion_comercial = situacion_comercial
        cliente.credito = credito
        cliente.save()
        

class ModificarClienteView(View):
    
    def post(self,req):
        pass


class CrearSituacionComercialView(View):
	
    def post(self, req):
		pass


index = IndexView.as_view()

cliente_existe = ClienteExisteView.as_view()
crear_cliente = CrearClienteView.as_view()
modificar_cliente = ModificarClienteView.as_view()

crear_situacion_comercial = CrearSituacionComercialView.as_view()