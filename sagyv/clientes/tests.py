#-*- coding: utf-8 -*-
import json
from django.test import TestCase
from django.core.urlresolvers import reverse, reverse_lazy
from clientes.models import TipoDescuento
from clientes.models import DescuentoCliente
from bodega.models import Producto


class SituacionComercialTestCase(TestCase):
    fixtures = ['descuentocliente.json']

    def setUp(self):
        tipo1 = TipoDescuento.objects.get(pk = 1)
        tipo2 = TipoDescuento.objects.get(pk = 2)
        producto1 = Producto.objects.get(pk = 1)
        producto2 = Producto.objects.get(pk = 2)

        DescuentoCliente.objects.create(
            monto_descuento = 5000,
            tipo_descuento = tipo1,
            producto = producto1
        )

        DescuentoCliente.objects.create(
            monto_descuento = 10,
            tipo_descuento = tipo2,
            producto = producto2
        )

    def test_get_situaciones_comerciales(self):
        response = self.client.get(reverse('clientes:obtener_situacion_comercial'))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), 2)

    def test_get_situacion_comercial(self):
        url = reverse('clientes:obtener_situacion_comercial') + '?id=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['monto_descuento'], 0)

    def test_crear(self):
        data = {'tipo': 1, 'valor': 1250, 'producto': 1}
        response = self.client.post(reverse('clientes:crear_situacion_comercial'), data)
        self.assertEqual(response.status_code, 200)

        cantidad = DescuentoCliente.objects.count()
        self.assertEqual(cantidad, 3)

    def test_actualizar(self):
        data = {'id': 1, 'tipo': 2, 'valor': 10, 'producto': 1}
        response = self.client.post(reverse('clientes:modificar_situacion_comercial'), data)
        self.assertEqual(response.status_code, 200)

        dc = DescuentoCliente.objects.get(pk = 1)
        self.assertEqual(dc.monto_descuento, 10)


