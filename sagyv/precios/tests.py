#-*- coding: utf-8 -*-
import json, random
from django.test import TestCase
from django.core.urlresolvers import reverse

from bodega.models import Producto
from bodega.models import PrecioProducto

# Create your tests here.
class PreciosTestCase(TestCase):
    fixtures = ['precios.json']

    def setUp(self):
        pass

    def test_obtener_productos(self):
        productos = Producto.objects.get_productos_filtrados()
        self.assertEqual(len(productos), 2)

    def test_obtener_precios(self):
        response = self.client.get(reverse("precios:obtener_productos"))
        data = json.loads(response.content)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)

    def test_actualizar_precios_productos(self):
        for i in range(0, 4):
            precios = self._crear_precios_productos()
            post_data = { "precios": json.dumps(precios) }

            response = self.client.post(reverse("precios:update_precios"), post_data)
            self.assertEqual(response.status_code, 200)

            producto1 = Producto.objects.get(pk = 1)
            producto2 = Producto.objects.get(pk = 2)

            self.assertEqual(len(producto1.precioproducto_set), i)
            self.assertEqual(len(producto2.precioproducto_set), i)

        self.assertEqual(len(PrecioProducto.objects.all()), 8)

    def _crear_precios_productos(self):
        productos = Producto.objects.get_productos_filtrados()
        precios = []

        for producto in productos:
            precios.append({
                "id": producto.id,
                "valor": random.randint(5000, 10000)
            })

        return precios

