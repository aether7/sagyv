import json
from datetime import date

from django.db import transaction
from django.core import serializers
from django.http import HttpResponse
from django.db.models import Q
from django.views.generic import View, TemplateView, ListView
from django.core.serializers.json import DjangoJSONEncoder
from main.helpers.fecha import convierte_texto_fecha, convierte_fecha_texto

from main.models import Vehiculo
from main.models import Trabajador
from main.models import TrabajadorVehiculo
from main.models import Movil

@transaction.atomic
def actualizar_estado_vehiculos(vehiculo, chofer):
    vehiculos_antiguos = TrabajadorVehiculo.objects.filter(Q(vehiculo = vehiculo, activo = True) |
        Q(trabajador = chofer, activo = True))

    for vehiculo_antiguo in vehiculos_antiguos:
        vehiculo_antiguo.activo = False
        vehiculo_antiguo.save()

def llenar_vehiculo_json(vehiculo):
    data = {
        "id": vehiculo.id,
        "movil": {
            "numero": vehiculo.get_numero_movil()
        },
        "patente": vehiculo.patente,
        "km": vehiculo.km,
        "fechaRevisionTecnica": vehiculo.fecha_revision_tecnica,
        "estadoSec": vehiculo.estado_sec,
        "estadoPago": vehiculo.estado_pago,
        "chofer": {
            "id": vehiculo.get_ultimo_chofer_id(),
            "nombre": vehiculo.get_nombre_ultimo_chofer()
        }
    }

    return data

def anexar_movil(trabajador, vehiculo, numero):
    if Movil.objects.filter(trabajador = trabajador).exists():
        movil = Movil.objects.get(trabajador = trabajador)
    else:
        movil = Movil()

    movil.vehiculo = vehiculo
    movil.trabajador = trabajador
    movil.numero = int(numero)
    movil.save()


class VehiculoList(ListView):
    context_object_name = "vehiculos"
    model = Vehiculo
    template_name = "vehiculos/index.html"
    queryset = Vehiculo.objects.all().order_by("numero")

    def get_context_data(self, *args, **kwargs):
        context_data = super(VehiculoList, self).get_context_data(*args, **kwargs)
        context_data["trabajadores"] = Trabajador.objects.all().order_by("id")

        return context_data


class ObtenerVehiculosView(View):
    def get(self, request):
        vehiculo_id = request.GET.get('id')

        if vehiculo_id is not None:
            data = self.obtener_vehiculo(vehiculo_id)
        else:
            data = self.obtener_vehiculos()

        data = json.dumps(data, cls=DjangoJSONEncoder)

        return HttpResponse(data, content_type="application/json")

    def obtener_vehiculo(self, id):
        vehiculo = Vehiculo.objects.get(pk = int(id))
        data = llenar_vehiculo_json(vehiculo)

        return data

    def obtener_vehiculos(self):
        vehiculos = Vehiculo.objects.order_by("id")
        data = []

        for vehiculo in vehiculos:
            v = llenar_vehiculo_json(vehiculo)
            data.append(v)

        return data


class AgregarNuevoVehiculoView(View):
    def post(self, request):
        fecha = request.POST.get('fechaRevisionTecnica')

        self.numero = request.POST.get('numero')
        self.patente = request.POST.get('patente')
        self.kilometraje = request.POST.get('kilometraje')
        self.estado_sec = request.POST.get('estadoSec')
        self.estado_pago = request.POST.get('estadoPago')
        self.chofer = json.loads(request.POST.get('chofer'))

        self.revision_tecnica = convierte_texto_fecha(fecha)

        vehiculo = self.__crear_nuevo_vehiculo()

        data = llenar_vehiculo_json(vehiculo)
        data = json.dumps(data, cls=DjangoJSONEncoder)

        return HttpResponse(data, content_type="application/json")

    @transaction.atomic
    def __crear_nuevo_vehiculo(self):
        vehiculo = Vehiculo()
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

        if int(self.chofer.get('id')) != 0:
            self.anexar_vehiculo_chofer(vehiculo)

        return vehiculo

    def anexar_vehiculo_chofer(self, vehiculo):
        chofer_id = int(self.chofer.get('id'))
        trabajador = Trabajador.objects.get(pk = chofer_id)

        self.desanexar_vehiculos_chofer(trabajador)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.trabajador = trabajador
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.save()

        anexar_movil(trabajador, vehiculo, self.numero)

    def desanexar_vehiculos_chofer(self, chofer):
        vehiculos_antiguos = TrabajadorVehiculo.objects.filter(trabajador = chofer, activo = True)

        for vehiculo_antiguo in vehiculos_antiguos:
            vehiculo_antiguo.activo = False
            vehiculo_antiguo.save()


class AnexarVehiculoView(View):

    @transaction.atomic
    def post(self, req):
        id_vehiculo = int(req.POST.get("id"))
        chofer_obj = json.loads(req.POST.get("chofer"))
        fecha = req.POST.get("fecha")

        chofer = None
        vehiculo = Vehiculo.objects.get( pk = id_vehiculo )
        movil = Movil.objects.filter( vehiculo = vehiculo )

        if chofer_obj['id'] != '':
            chofer = Trabajador.objects.get( pk = int(chofer_obj['id']) )

        movil.trabajador = chofer
        movil.save()

        actualizar_estado_vehiculos(vehiculo, chofer)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.trabajador = chofer
        trabajador_vehiculo.activo = True
        trabajador_vehiculo.save()

        data = {
            "status" : "ok",
            "nombre_chofer" : chofer.get_nombre_completo(),
            "numero_vehiculo" : vehiculo.numero,
            "id" : vehiculo.id
        }

        data = json.dumps(data, cls=DjangoJSONEncoder)

        return HttpResponse(data, content_type="application/json")


class ModificarView(View):

    @transaction.atomic
    def post(self, req):
        id_vehiculo = req.POST.get('id')
        fecha_revision_tecnica = req.POST.get('fechaRevisionTecnica')
        estado_sec = req.POST.get('estadoSec')
        estado_pago = req.POST.get('estadoPago')
        chofer = json.loads(req.POST.get('chofer'))

        vehiculo = Vehiculo.objects.get(pk = id_vehiculo)
        vehiculo.fecha_revision_tecnica = convierte_texto_fecha(fecha_revision_tecnica)

        if estado_sec == '0':
            vehiculo.estado_sec = False
        else:
            vehiculo.estado_sec = True

        if estado_pago == '0':
            vehiculo.estado_pago = False
        else:
            vehiculo.estado_pago = True

        vehiculo.save()


        self.procesar_chofer(chofer, vehiculo)
        data = llenar_vehiculo_json(vehiculo)
        data = json.dumps(data, cls = DjangoJSONEncoder)

        return HttpResponse(data, content_type="application/json")

    def procesar_chofer(self, chofer, vehiculo):
        chofer_actual = vehiculo.get_ultimo_chofer()

        if chofer['id'] != 0:
            if (chofer_actual is not None and chofer_actual.id != id_chofer) or chofer_actual is None:
                self.anexar_chofer_vehiculo(chofer['id'], vehiculo, vehiculo.fecha_revision_tecnica)

    def anexar_chofer_vehiculo(self, id_chofer, vehiculo, fecha_revision_tecnica):
        chofer = Trabajador.objects.get(pk = int(id_chofer))

        actualizar_estado_vehiculos(vehiculo, chofer)

        trabajador_vehiculo = TrabajadorVehiculo()
        trabajador_vehiculo.vehiculo = vehiculo
        trabajador_vehiculo.trabajador = chofer
        trabajador_vehiculo.activo = True
        trabajador_vehiculo.fecha = convierte_texto_fecha(fecha_revision_tecnica)
        trabajador_vehiculo.save()


index = VehiculoList.as_view()
agregar_nuevo_vehiculo = AgregarNuevoVehiculoView.as_view()
anexar_vehiculo = AnexarVehiculoView.as_view()
modificar = ModificarView.as_view()

obtener_vehiculos = ObtenerVehiculosView.as_view()
