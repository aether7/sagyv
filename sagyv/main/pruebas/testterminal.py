import json

from django.test import TestCase
from django.core.urlresolvers import reverse

from main.models import Terminal
from main.models import EstadoTerminal
from main.models import Movil

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
        print "****"
        mvl = Movil.objects.all()
        print mvl
        print "****"
        response = self.client.post(reverse('guias:remover_terminal'), post_data)
        self.assertEqual(response.status_code, 200, "No se pudo eliminar terminal")


# assertEqual(a, b)   a == b
# assertNotEqual(a, b)    a != b
# assertTrue(x)   bool(x) is True
# assertFalse(x)  bool(x) is False
