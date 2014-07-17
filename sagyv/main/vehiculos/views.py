import json
from datetime import datetime
from datetime import date

from django.db import transaction
from django.core import serializers
from django.http import HttpResponse
from django.db.models import Q
from django.views.generic import View, TemplateView, ListView
from main.models import Vehiculo, Trabajador, TrabajadorVehiculo

class VehiculoList(ListView):
    context_object_name = "vehiculos"
    model = Vehiculo
    template_name = "vehiculos/index.html"
    queryset = Vehiculo.objects.all().order_by("numero")

    def get_context_data(self, *args, **kwargs):
        context_data = super(VehiculoList, self).get_context_data(*args, **kwargs)
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

    @transaction.commit_on_success
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


class ObtenerView(View):
    def get(self, request, id_vehiculo):
        vehiculo_id = int(id_vehiculo)
        vehiculo = Vehiculo.objects.get(pk = vehiculo_id)

        data = {
            "id" : vehiculo.id,
            "numero" : vehiculo.numero,
            "patente" : vehiculo.patente,
            "fecha_revision_tecnica" : self.convertir_fecha_json(vehiculo.fecha_revision_tecnica),
            "km" : vehiculo.km,
            "estado_sec" : vehiculo.estado_sec,
            "estado_pago" : vehiculo.estado_pago,
            "chofer" : vehiculo.get_ultimo_chofer_id()
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def convertir_fecha_json(self, fecha):
        nueva_fecha = str(fecha.year) + "-" + str(fecha.month) + "-" + str(fecha.day)
        return nueva_fecha


class AnexarVehiculoView(View):

    def post(self, req):
        id = int(req.POST.get("id"))
        chofer_id = int(req.POST.get("chofer"))
        fecha = req.POST.get("fecha")

        vehiculo = Vehiculo.objects.get(pk = id)
        chofer = Trabajador.objects.get(pk = chofer_id)

        self.actualizar_estado_vehiculos(vehiculo, chofer)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.trabajador = chofer
        trabajador_vehiculo.activo = True
        trabajador_vehiculo.fecha = self.get_fecha(fecha)
        trabajador_vehiculo.save()

        data = {
            "status" : "ok",
            "nombre_chofer" : chofer.get_nombre_completo(),
            "numero_vehiculo" : vehiculo.numero
        }

        return HttpResponse(json.dumps(data), mimetype="application/json")

    @transaction.commit_on_success
    def actualizar_estado_vehiculos(self, vehiculo, chofer):
        vehiculos_antiguos = TrabajadorVehiculo.objects.filter(Q(vehiculo = vehiculo, activo = True) |
            Q(trabajador = chofer, activo = True))

        for vehiculo_antiguo in vehiculos_antiguos:
            vehiculo_antiguo.activo = False
            vehiculo_antiguo.save()

    def get_fecha(self, fecha):
        aux = fecha.split("-")
        nueva_fecha = date(int(aux[0]), int(aux[1]), int(aux[2]))

        return nueva_fecha

index = VehiculoList.as_view()
agregar_nuevo_vehiculo = AgregarNuevoVehiculoView.as_view()
anexar_vehiculo = AnexarVehiculoView.as_view()
obtener = ObtenerView.as_view()
