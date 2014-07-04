import json
from django.http import HttpResponse
from datetime import datetime
from django.views.generic import View, TemplateView, ListView
from main.models import Vehiculo, Trabajador, TrabajadorVehiculo

class VehiculoList(ListView):
    model = Vehiculo
    template_name = "vehiculos/index.html"
    queryset = Vehiculo.objects.all().order_by("numero")

    def get_context_data(self, *args, **kwargs):
        context_data = super(VehiculoList, self).get_context_data(*args, **kwargs)
        context_data["vehiculos"] = Vehiculo.objects.all()
        context_data["trabajadores"] = Trabajador.objects.all().order_by("id")

        return context_data


class AgregarNuevoVehiculoView(View):
    def post(self, request):
        self.numero = request.POST.get('numero')
        self.patente = request.POST.get('patente')
        fecha = request.POST.get('revision_tecnica')
        fecha = fecha.split('-')
        mes = int(fecha[1])

        if(mes < 10):
            mes = fecha[1].replace('0','')

        self.revision_tecnica = datetime(int(fecha[0]), int(mes), int(fecha[2]))

        self.kilometraje = request.POST.get('kilometraje')
        self.estado_sec = request.POST.get('estado_sec')
        self.estado_pago = request.POST.get('estado_pago')
        self.chofer = request.POST.get('chofer')


        vehiculo = self.__crear_nuevo_vehiculo()

        data = { "status" : "ok", "id_vehiculo" : vehiculo.id }

        return HttpResponse(json.dumps(data),content_type="application/json")


    def __crear_nuevo_vehiculo(self):
        vehiculo = Vehiculo()
        vehiculo.numero = self.numero
        vehiculo.patente = self.patente
        vehiculo.fecha_revision_tecnica = self.revision_tecnica
        vehiculo.km = self.kilometraje
        vehiculo.estado_sec = self.estado_sec
        vehiculo.estado_pago = self.estado_pago
        vehiculo.save()

        if self.chofer is not None and self.chofer != "":
            trabajador = Trabajador.objects.get(pk = self.chofer)
            trabajador_vehiculo = TrabajadorVehiculo()
            trabajador_vehiculo.trabajador = trabajador
            trabajador_vehiculo.vehiculo = vehiculo
            trabajador_vehiculo.save()

        return vehiculo

index = VehiculoList.as_view()
agregar_nuevo_vehiculo = AgregarNuevoVehiculoView.as_view()
