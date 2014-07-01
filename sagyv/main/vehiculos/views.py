import json
from django.http import HttpResponse
from django.views.generic import View, TemplateView, ListView
from main.models import Vehiculo, Trabajador, TrabajadorVehiculo

class VehiculoList(ListView):
    model = Vehiculo
    template_name = "vehiculos/index.html"

    def get_context_data(self, *args, **kwargs):
        context_data = super(VehiculoList, self).get_context_data(*args, **kwargs)
        context_data["vehiculos"] = Vehiculo.objects.all()
        context_data["trabajadores"] = Trabajador.objects.all().order_by("id")

        return context_data


class AgregarNuevoVehiculoView(View):
    def post(self, request):
        numero = request.POST.get('numero')
        patente = request.POST.get('patente')
        revision_tecnica = request.POST.get('revision_tecnica')
        kilometraje = request.POST.get('kilometraje')
        estado_sec = request.POST.get('estado_sec')
        estado_pago = request.POST.get('estado_pago')
        chofer = request.POST.get('chofer')

        vehiculo = self.__crear_nuevo_vehiculo(numero, patente, revision_tecnica, kilometraje, estado_sec, estado_pago, chofer)

        data = { "status" : "ok", "id_vehiculo" : vehiculo.id }

        return HttpResponse(json.dumps(data),content_type="application/json")


    def __crear_nuevo_vehiculo(self, numero, patente, revision_tecnica, kilometraje, estado_sec, estado_pago, chofer):
        vehiculo = Vehiculo()
        vehiculo.numero = numero
        vehiculo.patente = patente
        vehiculo.revision_tecnica = revision_tecnica
        vehiculo.kilometraje = kilometraje
        vehiculo.estado_sec = estado_sec
        vehiculo.estado_pago = estado_pago
        vehiculo.save()

        if chofer is not None and chofer != "":
            trabajador = Trabajador.objects.get(pk = chofer)
            trabajador_vehiculo = TrabajadorVehiculo()
            trabajador_vehiculo.trabajador = trabajador
            trabajador_vehiculo.vehiculo = vehiculo
            trabajador_vehiculo.save()

        return vehiculo

index = VehiculoList.as_view()
agregar_nuevo_vehiculo = AgregarNuevoVehiculoView.as_view()

numero, patente, revision_tecnica, kilometraje, estado_sec, estado_pago
