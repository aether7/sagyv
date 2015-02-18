import json, datetime

from django.test import TestCase
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from trabajador.models import Afp
from trabajador.models import SistemaSalud
from trabajador.models import EstadoCivil
from trabajador.models import EstadoVacacion
from trabajador.models import Trabajador
from trabajador.models import Vacacion
from trabajador.models import TipoTrabajador

class TrabajadorTestCase(TestCase):
    fixtures = ['trabajador.json']

    def setUp(self):
        User.objects.create_user(username = 'juanito', password = 'juanelo', email = 'juanelo@mailinator.com')

        afp = Afp.objects.get(pk = 1)
        salud = SistemaSalud.objects.get(pk = 1)
        civil = EstadoCivil.objects.get(pk = 1)
        estado = EstadoVacacion.objects.get(pk = 1)
        tipo_trabajador = TipoTrabajador.objects.get(pk = 1)

        trabajador = Trabajador()
        trabajador.nombre = "Alberto"
        trabajador.apellido = "Jerez"
        trabajador.domicilio = "Mercedez 414"
        trabajador.nacimiento = datetime.date(1990, 7, 13)
        trabajador.fecha_inicio_contrato = datetime.date(2013, 10, 11)
        trabajador.vigencia_licencia = datetime.date(2014, 1, 10)
        trabajador.afp = afp
        trabajador.sistema_salud = salud
        trabajador.estado_civil = civil
        trabajador.tipo_trabajador = tipo_trabajador
        trabajador.save()

        vacacion = Vacacion()
        vacacion.trabajador = trabajador
        vacacion.estado_vacacion = estado
        vacacion.fecha_inicio = datetime.date(2015, 1, 20)
        vacacion.activo = False
        vacacion.save()

    def test_agregar_trabajador_ok(self):
        afp = Afp.objects.get(pk = 1)
        salud = SistemaSalud.objects.get(pk = 1)
        civil = EstadoCivil.objects.get(pk = 1)
        estado = EstadoVacacion.objects.get(pk = 1)

        data = {
            "nombre": "Juanito",
            "apellido": "Alvarez",
            "rut": "1-9",
            "domicilio": "una calle cualquiera",
            "fechaNacimiento": "1990-06-05",
            "inicioContrato": "2010-10-10",
            "vigenciaLicencia": "2014-01-10",
            "afp": afp.id,
            "sistemaSalud": salud.id,
            "estadoCivil": civil.id,
            "estadoVacacion": estado.id,
            "tipoTrabajador": 1
        }

        self.client.login(username='juanito', password='juanelo')
        response = self.client.post(reverse("trabajador:crear"), data)
        self.assertEqual(response.status_code, 200)

        trabajador = Trabajador.objects.get(pk = 2)
        vacacion = trabajador.get_vacacion()

        self.assertEqual(trabajador.nombre, "Juanito")
        self.assertEqual(trabajador.rut, "1-9")
        self.assertTrue(vacacion is not None)
        self.assertEqual(vacacion, "al dia")

    def test_editar_trabajador_ok(self):
        afp = Afp.objects.get(pk = 1)
        salud = SistemaSalud.objects.get(pk = 1)
        civil = EstadoCivil.objects.get(pk = 1)
        estado = EstadoVacacion.objects.get(pk = 1)

        data = {
            "id": 1,
            "nombre": "Juanitops",
            "apellido": "Alvarezeae",
            "rut": "1-9",
            "domicilio": "una calle cualquiera123",
            "fechaNacimiento": "1990-06-05",
            "inicioContrato": "2010-10-10",
            "vigenciaLicencia": "2014-01-10",
            "afp": afp.id,
            "sistemaSalud": salud.id,
            "estadoCivil": civil.id,
            "estadoVacacion": estado.id,
            "tipoTrabajador": 1
        }

        self.client.login(username='juanito', password='juanelo')
        response = self.client.post(reverse("trabajador:modificar"), data)
        self.assertEqual(response.status_code, 200)

        trabajador = Trabajador.objects.get(pk = 1)
        self.assertEqual(trabajador.domicilio, "una calle cualquiera123")

    def test_eliminar_trabajador(self):
        data = { "id": 1 }
        self.client.login(username='juanito', password='juanelo')
        response = self.client.post(reverse("trabajador:eliminar"), data)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(Trabajador.objects.all().exists())

    def test_ver_detalle(self):
        self.client.login(username='juanito', password='juanelo')
        response = self.client.get(reverse("trabajador:obtener"), {"id": 1})
        data = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data.get("apellido"), "Jerez")


    def test_buscar_boleta(self):
        self.client.login(username='juanito', password='juanelo')
        response = self.client.get(reverse("trabajador:buscar_boleta"), {"id": 1})

        self.assertEqual(response.status_code, 200)

    def test_anexar_boleta(self):
        data = {
            "boletaInicial": 1,
            "boletaFinal": 50,
            "id": 1
        }

        self.client.login(username='juanito', password='juanelo')
        response = self.client.post(reverse("trabajador:guardar_boleta"), data)
        self.assertEqual(response.status_code, 200)

        worker = Trabajador.objects.get(pk = 1)
        boletas = worker.boletatrabajador_set.all().count()
        self.assertEqual(boletas, 1)
