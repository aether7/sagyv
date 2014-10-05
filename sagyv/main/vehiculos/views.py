import json
from datetime import date

from django.db import transaction
from django.core import serializers
from django.http import HttpResponse
from django.db.models import Q
from django.views.generic import View, TemplateView, ListView
from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto

from main.models import Vehiculo
from main.models import Trabajador
from main.models import TrabajadorVehiculo

@transaction.atomic
def actualizar_estado_vehiculos(vehiculo, chofer):
    vehiculos_antiguos = TrabajadorVehiculo.objects.filter(Q(vehiculo = vehiculo, activo = True) |
        Q(trabajador = chofer, activo = True))

    for vehiculo_antiguo in vehiculos_antiguos:
        vehiculo_antiguo.activo = False
        vehiculo_antiguo.save()


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
        fecha = request.POST.get('fecha_revision_tecnica')

        self.numero = request.POST.get('numero')
        self.patente = request.POST.get('patente')
        self.kilometraje = request.POST.get('kilometraje')
        self.estado_sec = request.POST.get('estado_sec')
        self.estado_pago = request.POST.get('estado_pago')
        self.chofer = request.POST.get('chofer')
        self.revision_tecnica = convierte_texto_fecha(fecha)

        vehiculo = self.__crear_nuevo_vehiculo()
        if(self.chofer != ''):
            chofer = Trabajador.objects.get(pk = self.chofer)
            name_chofer = chofer.get_nombre_completo()
        else:
            name_chofer = "No anexado"

        data = {
            "status" : "ok",
            "vehiculo": {
                "id": vehiculo.id,
                "numero": vehiculo.numero,
                "patente": vehiculo.patente,
                "km": vehiculo.km,
                "fecha_revision_tecnica": fecha,
                "estado_sec": vehiculo.estado_sec,
                "estado_pago": vehiculo.estado_pago,
                "get_ultimo_chofer": vehiculo.get_nombre_ultimo_chofer()
            }
        }

        return HttpResponse(json.dumps(data),content_type="application/json")

    @transaction.atomic
    def __crear_nuevo_vehiculo(self):
        vehiculo = Vehiculo()
        vehiculo.numero = self.numero
        vehiculo.patente = self.patente
        vehiculo.fecha_revision_tecnica = self.revision_tecnica
        vehiculo.km = self.kilometraje

        if self.estado_sec == '0':
            vehiculo.estado_sec = False
        else:
            vehiculo.estado_sec = True

        if self.estado_pago == '0':
            vehiculo.estado_pago = False
        else:
            vehiculo.estado_pago = True

        vehiculo.save()

        if self.chofer is not None and self.chofer != "":
            trabajador = Trabajador.objects.get(pk = self.chofer)
            self.desanexar_vehiculos_chofer(trabajador)

            trabajador_vehiculo = TrabajadorVehiculo()
            trabajador_vehiculo.trabajador = trabajador
            trabajador_vehiculo.vehiculo = vehiculo
            trabajador_vehiculo.save()

        return vehiculo

    def desanexar_vehiculos_chofer(self, chofer):
        vehiculos_antiguos = TrabajadorVehiculo.objects.filter(trabajador = chofer, activo = True)

        for vehiculo_antiguo in vehiculos_antiguos:
            vehiculo_antiguo.activo = False
            vehiculo_antiguo.save()


class ObtenerView(View):
    def get(self, request, id_vehiculo):
        vehiculo_id = int(id_vehiculo)
        vehiculo = Vehiculo.objects.get(pk = vehiculo_id)

        data = {
            "id" : vehiculo.id,
            "numero" : vehiculo.numero,
            "patente" : vehiculo.patente,
            "fecha_revision_tecnica" : convierte_fecha_texto(vehiculo.fecha_revision_tecnica),
            "km" : vehiculo.km,
            "estado_sec" : vehiculo.estado_sec,
            "estado_pago" : vehiculo.estado_pago,
            "chofer" : vehiculo.get_ultimo_chofer_id()
        }

        return HttpResponse(json.dumps(data), content_type="application/json")


class AnexarVehiculoView(View):

    def post(self, req):
        id_vehiculo = int(req.POST.get("id"))
        chofer_id = int(req.POST.get("chofer"))
        fecha = req.POST.get("fecha")

        vehiculo = Vehiculo.objects.get(pk = id_vehiculo)
        chofer = Trabajador.objects.get(pk = chofer_id)

        actualizar_estado_vehiculos(vehiculo, chofer)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.trabajador = chofer
        trabajador_vehiculo.activo = True
        trabajador_vehiculo.fecha = convierte_texto_fecha(fecha)
        trabajador_vehiculo.save()

        data = {
            "status" : "ok",
            "nombre_chofer" : chofer.get_nombre_completo(),
            "numero_vehiculo" : vehiculo.numero,
            "id" : vehiculo.id
        }

        return HttpResponse(json.dumps(data), content_type="application/json")


class ModificarView(View):

    @transaction.atomic
    def post(self, req):
        id_vehiculo = req.POST.get('id_vehiculo')
        fecha_revision_tecnica = req.POST.get('fecha_revision_tecnica')
        estado_sec = req.POST.get('estado_sec')
        estado_pago = req.POST.get('estado_pago')
        id_chofer = req.POST.get('chofer')

        vehiculo = Vehiculo.objects.get(pk = id_vehiculo)
        chofer_actual = vehiculo.get_ultimo_chofer()

        vehiculo.fecha_revision_tecnica = convierte_texto_fecha(fecha_revision_tecnica)
        vehiculo.estado_sec = estado_sec
        vehiculo.estado_pago = estado_pago

        if estado_sec == '0':
            vehiculo.estado_sec = False
        else:
            vehiculo.estado_sec = True

        if estado_pago == '0':
            vehiculo.estado_pago = False
        else:
            vehiculo.estado_pago = True


        vehiculo.save()

        if id_chofer != "":
            if (not(chofer_actual is None) and chofer_actual.id != id_chofer) or chofer_actual is None:
                self.anexar_chofer_vehiculo(id_chofer, vehiculo, fecha_revision_tecnica)

        data = {
            "status": "ok",
            "vehiculo": {
                "id": vehiculo.id,
                "numero": vehiculo.numero,
                "patente": vehiculo.patente,
                "km": vehiculo.km,
                "fecha_revision_tecnica": convierte_fecha_texto(vehiculo.fecha_revision_tecnica),
                "estado_sec": vehiculo.estado_sec,
                "estado_pago": vehiculo.estado_pago,
                "get_nombre_ultimo_chofer": vehiculo.get_nombre_ultimo_chofer()
            }
        }

        return HttpResponse(json.dumps(data), content_type="application/json")

    def anexar_chofer_vehiculo(self, id_chofer, vehiculo, fecha_revision_tecnica):
        chofer = Trabajador.objects.get(pk = int(id_chofer))

        actualizar_estado_vehiculos(vehiculo, chofer)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.trabajador = chofer
        trabajador_vehiculo.activo = True
        trabajador_vehiculo.fecha = convierte_texto_fecha(fecha_revision_tecnica)
        trabajador_vehiculo.save()


class ObtenerVehiculosView(View):

    def get(self, request):
        vehiculos = Vehiculo.objects.all().order_by("id")
        data = []

        for vehiculo in vehiculos:
            v = {
                "id" : vehiculo.id,
                "numero" : vehiculo.numero,
                "patente" : vehiculo.patente,
                "km" : vehiculo.km,
                "fecha_revision_tecnica" : convierte_fecha_texto(vehiculo.fecha_revision_tecnica),
                "estado_sec" : vehiculo.estado_sec,
                "estado_pago" : vehiculo.estado_pago,
                "get_nombre_ultimo_chofer" : vehiculo.get_nombre_ultimo_chofer()
            }

            data.append(v)

        return HttpResponse(json.dumps(data),content_type="application/json")

index = VehiculoList.as_view()
agregar_nuevo_vehiculo = AgregarNuevoVehiculoView.as_view()
anexar_vehiculo = AnexarVehiculoView.as_view()
obtener = ObtenerView.as_view()
modificar = ModificarView.as_view()
obtener_vehiculos = ObtenerVehiculosView.as_view()
