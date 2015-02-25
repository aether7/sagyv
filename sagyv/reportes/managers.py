from django.db import connections, models, connection
from django.db.models import Q, Sum


def dictfetchall(cursor):
    # Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

class DetalleCredito(object):

    def __init__(self):
        self.venta_id = 0
        self.numero_serie =0
        self.monto = 0
        self.fecha = None
        self.cliente_id = 0
        self.nombre_cliente = ""
        self.tipo_cuotas = ""
        self.numero_tarjeta = 0
        self.numero_operacion = 0
        self.numero_cuotas = 0
        self.cuotas_pagadas = 0
        self.cant_cuotas_pagadas = 0
        self.cuotas_impagas = 0
        self.cant_cuotas_impagas = 0


class KilosVendidos(object):

    def __init__(self):

        trabajador_id = 0
        trabajador_nombre = ""
        producto_id = 0
        producto_nombre = ""
        producto_codigo = ""
        producto_peso = 0
        suma_kilos = 0


class Stock(object):

    def __init__(self):
        self.codigo = 0
        self.producto_id = 0
        self.nombre = ''
        self.cantidad = 0


class ReportesManager(models.Manager):
    def get_consumos_cliente_producto(self,cliente=None, fecha_inicio=None, fecha_termino=None):
        consulta_sql = """
            SELECT
                cliente.nombre AS cliente_nombre,
                cliente.es_lipigas AS cliente_es_lipigas,
                cliente.es_propio AS cliente_es_propio,
                producto.id AS producto_id,
                producto.codigo AS producto_codigo,
                SUM(detalle.cantidad) AS producto_cantidad,
                liquidacion.fecha AS liquidacion_fecha
            FROM clientes_cliente cliente
            INNER JOIN liquidacion_guiaventa guia ON(cliente.id = guia.cliente_id)
            INNER JOIN liquidacion_detalleguiaventa detalle ON(guia.id = detalle.guia_venta_id)
            INNER JOIN liquidacion_liquidacion liquidacion ON(guia.liquidacion_id = liquidacion.id)
            INNER JOIN bodega_producto producto ON(detalle.producto_id = producto.id)
            WHERE :condiciones
            GROUP BY producto.id
            ORDER BY producto_cantidad DESC
        """

        condiciones = ["1 = 1"]

        if cliente is not None:
            condiciones.append("cliente.id = %s" % cliente.id)

        if fecha_inicio is not None and fecha_termino is not None:
            condiciones.append("liquidacion.fecha BETWEEN '%s' AND '%s'" %(fecha_inicio, fecha_termino))
        elif fecha_inicio is not None:
            condiciones.append("liquidacion.fecha >= '%s'" % fecha_inicio)
        elif fecha_termino is not None:
            condiciones.append("liquidacion.fecha <= '%s'" % fecha_termino)

        if len(condiciones) > 0:
            consulta_sql = consulta_sql.replace(':condiciones', ' AND '.join(condiciones))

        cursor = connections['default'].cursor()
        cursor.execute(consulta_sql)
        data = dictfetchall(cursor)

        resultado = []

        for row in data:
            rs = {
                'cliente': {
                    'nombre': row['cliente_nombre']
                },
                'producto': {
                    'id': row['producto_id'],
                    'codigo': row['producto_codigo'],
                    'cantidad': row['producto_cantidad']
                },
                'liquidacion': {
                    'fecha': row['liquidacion_fecha']
                }
            }

            if row['cliente_es_lipigas'] and row['cliente_es_propio']:
                rs['cliente']['tipo'] = 'lipigas y propio'
            elif row['cliente_es_lipigas']:
                rs['cliente']['tipo'] = 'lipigas'
            elif row['cliente_es_propio']:
                rs['cliente']['tipo'] = 'propio'

            resultado.append(rs)

        return resultado

    def get_kilos_vendidos_trabajor(self, fecha_inicio=None, fecha_termino=None):

        consulta_sql = ""

        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            fila = KilosVendidos()
            fila.trabajador_id = row[0]
            fila.trabajador_nombre = row[1]
            fila.producto_id = row[2]
            fila.producto_nombre = row[3]
            fila.producto_peso = row[4]
            fila.suma_kilos = row[5]
            fila.producto_codigo = row[6]

            resultado.append(fila)

        return resultado

    def detalle_cuotas_creditos(self, fecha_inicio=None, fecha_termino=None):
        consulta_sql = ""

        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():

            fila = DetalleCredito()
            fila.venta_id = row[0]
            fila.numero_serie = row[1]
            fila.monto = row[2]
            fila.fecha = row[3]
            fila.cliente_id = row[4]
            fila.nombre_cliente = row[5]
            fila.tipo_cuotas = row[6]
            fila.numero_tarjeta = row[7]
            fila.numero_operacion = row[8]
            fila.numero_cuotas = row[9]
            fila.cuotas_pagadas = row[10] or 0
            fila.cant_cuotas_pagadas = row[11] or 0
            fila.cuotas_impagas = row[12] or 0
            fila.cant_cuotas_impagas = row[13] or 0

            resultado.append(fila)

        return resultado
