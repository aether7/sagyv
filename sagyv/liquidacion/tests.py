from django.test import TestCase

class LiquidacionTestCase(TestCase):
    fixtures = ('sagyv.json',)

    def test_busca_guia_despacho(self):
        url = '/liquidacion/obtener-guia/?id_guia_despacho=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_busca_guia_despacho_no_valida(self):
        url = '/liquidacion/obtener-guia/?id_guia_despacho=2'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
