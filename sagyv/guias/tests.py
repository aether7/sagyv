from django.test import TestCase

# Create your tests here.
import json

from django.test import TestCase
from django.core.urlresolvers import reverse

from liquidacion.models import Terminal
from liquidacion.models import EstadoTerminal
from bodega.models import Movil

class TerminalTestCase(TestCase):
    fixtures = ['terminales.json']

    def test_todos_terminales(self):
        response = self.client.get(reverse('guias:obtener_terminales'))
        data = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data.get('terminales')), 1)

    def test_crear_terminal_con_movil(self):
        post_data = {
            "codigo": "rvecter123",
            "movil": "{ \"id\": 1 }"
        }

        response = self.client.post(reverse("guias:crear_terminal"), post_data)
        self.assertEqual(response.status_code, 200, "Error al crear terminal con movil")

    def test_remover_terminal(self):
        post_data = { "id": 1 }
        response = self.client.post(reverse('guias:remover_terminal'), post_data)
        self.assertEqual(response.status_code, 200, "No se pudo eliminar terminal")

    def test_asignar_terminal(self):
        post_data = { "id" : 1, "movil" : 2}
        response = self.client.post(reverse('guias:reasignar_terminal'), post_data)
        self.assertEqual(response.status_code, 200, "No se pudo asignar terminal")

    def test_editar_terminal(self):
        post_data = {"id": 1, "codigo": "3131"}
        terms = Terminal.objects.all()

        response = self.client.post(reverse('guias:editar_terminal'), post_data)
        self.assertEqual(response.status_code, 200, "No se pudo asignar terminal")

        terms = Terminal.objects.all()
