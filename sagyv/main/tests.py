from django.test import TestCase, Client

from main.models import Producto
from main.models import TipoProducto
from main.models import TipoDescuento


class ProductoTestCase(TestCase):

    def setUp(self):
        tp = TipoProducto.objects.create(nombre = 'TipoProducto')
        Producto.objects.create(codigo = 1105, nombre = '5 kilos' ,
            peso = 5, tipo_producto = tp , stock = 10,
            nivel_critico = 1 , orden = 0)
        TipoDescuento.objects.create(tipo='fijo')
        TipoDescuento.objects.create(tipo='porcentual')

    def test_crearSituacionComercial(self):
        client = Client()

        post = {
            'tipo' : 1,
            'valor' : 2000,
            'producto' : 1
        }
        print res.context
        res = client.post('/panel-control/crear-situacion-comercial/', post)

        res.assertEqual(res.status_code, 200)
