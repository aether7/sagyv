from django.db import connection, models
from django.db.models import Q

class Stock(object):

    def __init__(self):
        self.codigo = 0
        self.producto_id = 0
        self.nombre = ''
        self.cantidad = 0


class StockManager(models.Manager):

    def get_stock_transito(self):
        consulta_sql = """
            SELECT  mp.codigo as codigo,
                    msv.producto_id as producto_id,
                    mtp.nombre as nombre,
                    SUM(msv.cantidad) as cantidad
            FROM main_stockvehiculo msv
            INNER JOIN main_producto mp ON(msv.producto_id = mp.id)
            INNER JOIN main_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
            GROUP BY mp.codigo, mp.peso, msv.producto_id, mtp.nombre;
        """
        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            p = Stock()
            p.codigo = row[0]
            p.producto_id = row[1]
            p.nombre = row[2]
            p.cantidad = row[3]

            resultado.append(p)

        return resultado

    def get_stock_consolidado(self):
        consulta_sql = """
            SELECT  mp.codigo,
                    mp.peso,
                    mtp.nombre,
                    mp.stock as stock,
                    (SELECT cantidad FROM main_stockvehiculo WHERE producto_id = mp.id) as cantidad,
                    mp.id

            FROM main_producto mp

            INNER JOIN main_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
            GROUP BY mp.codigo, mp.peso, mtp.nombre, mp.stock,mp.id
        """

        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            p = Stock()
            p.codigo = row[0]
            p.peso = row[1]
            p.nombre = row[2]

            if row[4] is not None:
                p.cantidad = (row[3] + row[4]) or 0
            else:
                p.cantidad = (row[3]) or 0

            resultado.append(p)

        return resultado


class ClienteManager(models.Manager):
    def busqueda_por_campo(self, valor):
        resultados = self.filter(
            Q(nombre__contains = valor)|
            Q(giro__contains = valor)|
            Q(rut__contains = valor)
        )

        return resultados


class TarjetaCreditoManager(models.Manager):
    TARJETA_CREDITO = 1
    TARJETA_DEBITO = 2
    TARJETA_COMERCIAL = 3

    def get_tarjetas_comerciales(self):
        resultados = self.filter(tipo_tarjeta_id = self.TARJETA_COMERCIAL)
        return resultados

    def get_tarjetas_bancarias(self):
        resultados = self.filter(
            Q(tipo_tarjeta_id = self.TARJETA_DEBITO) |
            Q(tipo_tarjeta_id = self.TARJETA_CREDITO)
        ).order_by("-tipo_tarjeta")

        return resultados
