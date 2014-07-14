from django.views.generic import TemplateView,View
from django.http import HttpResponse
from main.models import Cliente, DescuentoCliente

class IndexView(TemplateView):
	template_name = "cliente/index.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context["clientes"] = Cliente.objects.all()
		return context


class ObtenerClienteView(View):

    def get(self, req, id_cliente):


        pass


class CrearClienteView(View):
	
    def post(self, req):
        giro = req.POST.get('')
        direccion = req.POST.get('')
        telefono = req.POST.get('')
        rut = req.POST.get('')
        situacion_comercial = req.POST.get('')
        credito = req.POST.get('')

        if(self.validarCliente(rut)):
            if situacion_comercial != '' :
                sc = DescuentoCliente.objects.get(pk = situacion_comercial) 

            cliente = Cliente()
            cliente.giro = giro
            cliente.direccion = direccion
            cliente.telefono = telefono
            cliente.rut = rut
            cliente.situacion_comercial = sc
            cliente.credito = credito
            cliente.save()

            dato = { "status": "ok" }

        else:
            dato = { "status": "error", "status_message": "El cliente ya existe." }

        return HttpResponse(json.dumps(dato), content_type="application/json")

    def validarCliente(rut):
        flag = True
        try:
            cliente_existe = Cliente.objects.get(rut = rut)
            flag = False

        except cliente_existe.DoesNotExist:
            flag = True

        return flag
        

class ModificarClienteView(View):
    
    def post(self,req):
        pass


class CrearSituacionComercialView(View):
	
    def post(self, req):
		pass


index = IndexView.as_view()

obtener_cliente = ObtenerClienteView.as_view()
crear_cliente = CrearClienteView.as_view()
modificar_cliente = ModificarClienteView.as_view()

crear_situacion_comercial = CrearSituacionComercialView.as_view()