from django.db import connections, models, connection
from django.db.models import Q, Sum

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
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


class ConsumoCliente(object):

    def __init__(self):
        self.id_cliente = 0
        self.nombre_cliente = None
        self.rut_cliente = None
        self.es_lipigas = False
        self.es_propio = False
        self.credito = False
        self.monto_descuento = False
        self.tipo_descuento = None

        self.id_producto = 0
        self.nombre_producto = None
        self.codigo_producto = None
        self.cantidad_producto = None
        self.suma_monto = 0

    def get_tipo_cliente(self):
        texto = 'Cliente '

        if self.es_lipigas and self.es_propio:
            texto += 'Lipigas y Propio'
        elif self.es_lipigas:
            texto += 'Lipigas'
        elif self.es_propio:
            texto += 'Propio'

        return texto

class ReportesManager(models.Manager):
    def get_consumos_cliente_producto(self,cliente = None, fecha_inicio = None, fecha_termino = None):

        consulta_sql = """
            SELECT
                c.id as cliente_id,
                c.rut as cliente_rut,
                c.nombre as cliente_nombre,
                c.es_lipigas as cliente_lipigas,
                c.es_propio as cliente_propio,
                c.credito as cliente_credito,
                (
                    SELECT
                        p.id as id_producto
                    FROM main_guiaventa gv
                    INNER JOIN main_detalleguiaventa dgv ON(dgv.guia_venta_id = gv.id)
                    INNER JOIN main_producto p ON(dgv.producto_id = p.id)
                    WHERE gv.cliente_id = c.id
                    GROUP BY dgv.producto_id
                    ORDER BY SUM(dgv.cantidad) DESC
                    LIMIT 1
                ) as producto_id,
                (
                    SELECT
                        SUM(dgv.cantidad) as producto_cantidad
                    FROM main_guiaventa gv
                    INNER JOIN main_detalleguiaventa dgv ON(dgv.guia_venta_id = gv.id)
                    WHERE gv.cliente_id = c.id
                    GROUP BY dgv.producto_id
                    ORDER BY cantidad DESC
                    LIMIT 1
                ) as producto_cantidad,
                (
                    SELECT
                        p.codigo as producto_codigo
                    FROM main_guiaventa gv
                    INNER JOIN main_detalleguiaventa dgv ON(dgv.guia_venta_id = gv.id)
                    INNER JOIN main_producto p ON(dgv.producto_id = p.id)
                    WHERE gv.cliente_id = c.id
                    GROUP BY dgv.producto_id
                    ORDER BY SUM(dgv.cantidad) DESC
                    LIMIT 1
                ) as producto_codigo
            FROM main_cliente c
        """

        condiciones = []

        if cliente is not None:
            condiciones.append( "c.id = %s" % cliente.id )

        if fecha_inicio is not None and fecha_termino is not None:
            condiciones.append( "l.fecha BETWEEN '%s' AND '%s'" % (fecha_inicio, fecha_termino) )
        elif fecha_inicio is not None:
            condiciones.append("l.fecha >= '%s' " % (fecha_inicio))
        elif fecha_termino is not None:
            condiciones.append("l.fecha <= '%s'" % (fecha_termino))

        if len(condiciones) > 0:
            consulta_sql += "WHERE " + " AND ".join(condiciones)

        cursor = connections['default'].cursor()
        cursor.execute(consulta_sql)
        data = dictfetchall(cursor)

        resultado = []

        for row in data:
            fila = ConsumoCliente()

            fila.id_cliente = row['cliente_id']
            fila.nombre_cliente = row['cliente_nombre']
            fila.rut_cliente = row['cliente_rut']
            fila.es_propio = row['cliente_propio']
            fila.es_lipigas = row['cliente_lipigas']
            fila.credito = row['cliente_credito']
            fila.id_producto = row['producto_id']
            fila.codigo_producto = row['producto_codigo']
            fila.cantidad_producto = row['producto_cantidad']

            resultado.append(fila)

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

    def detalle_cuotas_creditos(self, fecha_inicio = None, fecha_termino = None):

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
