#-*- coding: utf-8 -*-
import json
from django.test import TestCase
from django.core.urlresolvers import reverse, reverse_lazy
from bodega.models import Producto
from clientes.models import TipoDescuento
from clientes.models import DescuentoCliente
from clientes.models import Cliente

class SituacionComercialTestCase(TestCase):
    fixtures = ['descuentocliente.json']

    def setUp(self):
        tipo1 = TipoDescuento.objects.get(pk = 1)
        tipo2 = TipoDescuento.objects.get(pk = 2)
        producto1 = Producto.objects.get(pk = 1)
        producto2 = Producto.objects.get(pk = 2)

        DescuentoCliente.objects.create(monto_descuento = 0, tipo_descuento = tipo1)

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
        self.assertEqual(data['monto'], 0)

    def test_crear(self):
        data = {
            'monto': 5000,
            'tipoDescuento': '{ "id": 1, "tipo": "Fijo" }',
            'producto': '{"id": 1, "codigo": 1105, "nombre": "5 kilos"}'
        }

        response = self.client.post(reverse('clientes:crear_situacion_comercial'), data)
        self.assertEqual(response.status_code, 200)

        cantidad = DescuentoCliente.objects.count()
        self.assertEqual(cantidad, 4)

    def test_actualizar(self):
        data = {
            'id': 2,
            'monto': 10,
            'tipoDescuento': '{ "id": 2, "tipo": "Porcentaje" }',
            'producto': '{"id": 1, "codigo": 1105, "nombre": "5 kilos"}'
        }

        response = self.client.post(reverse('clientes:modificar_situacion_comercial'), data)
        self.assertEqual(response.status_code, 200)

        dc = DescuentoCliente.objects.get(pk = 2)
        self.assertEqual(dc.monto_descuento, 10)

    def test_borrar(self):
        pass


class ClienteTestCase(TestCase):
    fixtures = ['descuentocliente.json']

    def setUp(self):
        Cliente.objects.create(
            nombre = 'Juanito',
            giro = 'Juanito Corp',
            direccion = 'stgo centro, en su casa #123',
            telefono = '72314534',
            rut = '1-9',
            credito = False,
            dispensador = False,
            es_lipigas = False,
            es_propio = True,
            observacion = 'Una observación cualquiera oezi'
        )

        Cliente.objects.create(
            nombre = 'Merce',
            giro = 'Merce ltda',
            direccion = 'alguna calle de chile',
            telefono = '87766554',
            rut = '14495886-1',
            credito = True,
            dispensador = False,
            es_lipigas = True,
            es_propio = True,
            observacion = ''
        )

    def test_get_clientes(self):
        response = self.client.get(reverse('clientes:obtener'))
        self.assertEqual(response.status_code, 200)

        clientes = json.loads(response.content)
        self.assertEqual(len(clientes), 2)

    def test_get_cliente(self):
        url = reverse('clientes:obtener') + '?id=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        cliente = json.loads(response.content)
        self.assertEqual(cliente['nombre'], 'Juanito')

    def test_crear(self):
        pass

    def test_actualizar(self):
        pass

    def test_eliminar(self):
        pass
