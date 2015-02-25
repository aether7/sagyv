# -*- coding: utf-8 -*-
import json

from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.test import TestCase
from bodega.models import Vehiculo

from trabajador.models import Afp
from trabajador.models import SistemaSalud
from trabajador.models import EstadoCivil
from trabajador.models import Trabajador
from trabajador.models import TipoTrabajador
from bodega.models import Movil


class VehiculoTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(
            username='juanito',
            password='juanelo',
            email='juanelo@mailinator.com'
        )
        self.crear_vehiculos()
        self.crear_trabajadores()

    def crear_vehiculos(self):
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

    def crear_trabajadores(self):
        afp = Afp.objects.create(nombre='Sura')
        sys_heal = SistemaSalud.objects.create(nombre='Cruz blanca')
        estado_civil = EstadoCivil.objects.create(nombre='Soltero')

        TipoTrabajador.objects.create(nombre='chofer')

        Trabajador.objects.create(
            nombre='Norman',
            apellido='Glaves',
            rut='17118730-3',
            domicilio='Calle limache 1210 dept 101',
            nacimiento='1988-11-30',
            fecha_inicio_contrato='2010-05-01',
            vigencia_licencia='2018-11-30',
            afp=afp,
            sistema_salud=sys_heal,
            estado_civil=estado_civil,
            tipo_trabajador_id=1
        )

        Trabajador.objects.create(
            nombre='Karla',
            apellido='Vargas',
            rut='17352945-7',
            domicilio='Calle limache 1210 dept 101',
            nacimiento='1988-11-30',
            fecha_inicio_contrato='2010-05-01',
            vigencia_licencia='2018-11-30',
            afp=afp,
            sistema_salud=sys_heal,
            estado_civil=estado_civil,
            tipo_trabajador_id=1
        )

    def test_obtener_vehiculos(self):
        self.client.login(username='juanito', password='juanelo')
        res = self.client.get(reverse('vehiculos:obtener_vehiculos'))

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(len(data), 2)

    def test_obtener_vehiculo(self):
        self.client.login(username='juanito', password='juanelo')
        res = self.client.get(reverse('vehiculos:obtener_vehiculos') + '?id=1')

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['patente'], 'ec1313')

    def test_nuevo_vehiculo_sin_chofer(self):
        post_data = {
            "numero": 33,
            "patente": "ec1313",
            "kilometraje": 10,
            "fechaRevisionTecnica": "2014-12-16",
            "estadoSec": "0",
            "estadoPago": "1",
            "chofer": "{ \"id\": 0 }"
        }

        self.client.login(username='juanito', password='juanelo')
        res = self.client.post(reverse('vehiculos:agregar_nuevo_vehiculo'), post_data)

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['chofer']['id'], 0)

    def test_nuevo_vehiculo_con_chofer(self):
        post_data = {
            "numero": 32,
            "patente": "GGWP01",
            "kilometraje": 200,
            "fechaRevisionTecnica": "2014-12-30",
            "estadoSec": "1",
            "estadoPago": "1",
            "chofer": "{ \"id\" : 1, \"nombre\" : \"Norman Glaves\"}"
        }

        self.client.login(username='juanito', password='juanelo')
        res = self.client.post(reverse('vehiculos:agregar_nuevo_vehiculo'), post_data)

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['chofer']['id'], 1)

    def test_editar_vehiculo_sin_chofer(self):
        post_data = {
            "id": 1,
            "patente": "pshr12",
            "km": 10,
            "estadoPago": "1",
            "estadoSec": "1",
            "fechaRevisionTecnica": "2014-12-21",
            "chofer": "{ \"id\": 0 }"
        }

        self.client.login(username='juanito', password='juanelo')
        res = self.client.post(reverse('vehiculos:modificar'), post_data)

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['chofer']['id'], 0)

    def test_editar_vehiculo_con_chofer(self):
        post_data = {
            "id": 2,
            "numero": 32,
            "patente": "GGWP01",
            "kilometraje": 200,
            "fechaRevisionTecnica": "2014-12-30",
            "estadoSec": "1",
            "estadoPago": "1",
            "chofer": "{ \"id\": 2, \"nombre\" : \"Karla Vargas\" }"
        }

        self.client.login(username='juanito', password='juanelo')
        res = self.client.post(reverse('vehiculos:modificar'), post_data)

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['chofer']['id'], 2)

    def test_anexar_chofer(self):
        post_data = {
            "numero": 32,
            "patente": "GGWP01",
            "kilometraje": 200,
            "fechaRevisionTecnica": "2014-12-30",
            "estadoSec": "1",
            "estadoPago": "1",
            "chofer": "{ \"id\" : 1, \"nombre\" : \"Norman Glaves\"}"
        }

        self.client.login(username='juanito', password='juanelo')
        res = self.client.post(reverse('vehiculos:agregar_nuevo_vehiculo'), post_data)

        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['chofer']['id'], 1)

        moviles = Movil.objects.all()

        """ Anexo """

        post_data = {
            "id": 3,
            "chofer": "{ \"id\": 0, \"nombre\" : \"Karla Vargas\" }",
            "fecha": "2014-12-10"
        }

        res = self.client.post(reverse('vehiculos:anexar_vehiculo'), post_data)
        self.assertEqual(res.status_code, 200)

        data = json.loads(res.content)
        self.assertEqual(data['id'], 3)
