import json

from django.test import TestCase, Client
from django.test import Client
from main.models import Vehiculo

class VehiculoTestCase(TestCase):

    def setUp(self):
        Vehiculo.objects.create(
            patente='ec1313',
            km=0,
            estado_pago=0,
            estado_sec=0,
            fecha_revision_tecnica='2014-12-12'
        )

        Vehiculo.objects.create(
            patente='ng4545',
            km=10000,
            estado_pago=1,
            estado_sec=1,
            fecha_revision_tecnica='2014-12-12'
        )

    def test_obtener_vehiculos(self):
        client = Client()
        res = client.get('/panel-control/vehiculos/obtener/')
        data = json.loads(res.content)

        self.assertEqual(len(data), 2)

    def test_obtener_vehiculo(self):
        client = Client()
        res = client.get('/panel-control/vehiculos/obtener/?id=1')
        data = json.loads(res.content)

        self.assertEqual(data['patente'], 'ec1313')

    def test_nuevo_vehiculo_sin_chofer(self):
        client = Client()

        post_data = {
            "numero": 33,
            "patente": "ec1313",
            "kilometraje": 10,
            "fechaRevisionTecnica": "2014-12-16",
            "estadoSec": "0",
            "estadoPago": "1",
            "chofer": "{ \"id\": 0 }"
        }

        res = client.post('/panel-control/vehiculos/agregar-nuevo-vehiculo/', post_data)
        data = json.loads(res.content)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['chofer']['id'], 0)
