from django.db import connections, models, connection
from django.db.models import Sum


class Stock(object):
    def __init__(self):
        self.codigo = 0
        self.producto_id = 0
        self.nombre = ''
        self.cantidad = 0


class ProductoManager(models.Manager):
    GARANTIAS = 3

    def get_productos_filtrados(self):
        queryset = self.exclude(tipo_producto_id=ProductoManager.GARANTIAS)
        productos = queryset.exclude(codigo=1515).order_by('orden')
        return productos

    def get_garantias(self):
        garantias = self.filter(tipo_producto_id=ProductoManager.GARANTIAS).order_by('id')
        return garantias

    def get_garantias_filtradas(self):
        queryset = self.filter(tipo_producto_id=3).exclude(codigo=3215).exclude(codigo=3315)
        return queryset


class HistorialStockManager(models.Manager):
    def get_productos_guia_recarga(self, guia):
        query = self.filter(guia_despacho=guia).values('producto_id', 'es_recarga', 'producto__codigo')
        productos = query.annotate(cantidad_total=Sum('cantidad'))

        return productos

    def get_productos_guia_total(self, guia):
        queryset = self.values('id', 'fecha', 'guia_despacho_id', 'producto_id', 'factura_id', 'es_recarga')
        queryset = queryset.filter(guia_despacho_id=guia.id).annotate(cantidad=Sum('cantidad'))

        return queryset


class GuiaDespachoManager(models.Manager):
    def get_ultimo_despacho_id(self):
        if self.exclude(numero=None).exists():
            return self.exclude(numero=None).latest('id')
        else:
            return None


class VehiculoManager(models.Manager):
    def get_vehiculos_con_chofer(self):
        return self.filter(trabajadorvehiculo__activo=1)


class StockManager(models.Manager):

    def get_stock_transito(self):
        resultados = self.values('producto__id',
            'producto__codigo',
            'producto__tipo_producto__nombre').annotate(cantidad=Sum('cantidad'))

        data = []

        for res in resultados:
            p = Stock()
            p.codigo = res['producto__codigo']
            p.producto_id = res['producto__id']
            p.nombre = res['producto__tipo_producto__nombre']
            p.cantidad = res['cantidad']

            data.append(p)

        return data

    def get_stock_consolidado(self):
        consulta_sql = """
            SELECT  mp.codigo,
                    mp.peso,
                    mtp.nombre,
                    mp.stock as stock,
                    (SELECT SUM(cantidad) FROM bodega_stockvehiculo WHERE producto_id = mp.id) as cantidad,
                    mp.id
            FROM bodega_producto mp
            INNER JOIN bodega_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
            GROUP BY
                mp.codigo,
                mp.peso,
                mtp.nombre,
                mp.stock,mp.id
        """

        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            p = Stock()
            p.codigo = row[0]
            p.peso = row[1]
            p.nombre = row[2]
            p.producto_id = row[5]

            if row[4] is not None:
                p.cantidad = (row[3] + row[4]) or 0
            else:
                p.cantidad = (row[3]) or 0

            resultado.append(p)

        return resultado
