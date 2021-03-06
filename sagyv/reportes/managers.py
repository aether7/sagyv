from django.db import connections, models, connection
from utils.db import dictfetchall


class DetalleCredito(object):

    def __init__(self):
        self.venta_id = 0
        self.numero_serie = 0
        self.monto = 0
        self.fecha = None
        self.cliente_id = 0
        self.nombre_cliente = ''
        self.tipo_cuotas = ''
        self.numero_tarjeta = 0
        self.numero_operacion = 0
        self.numero_cuotas = 0
        self.cuotas_pagadas = 0
        self.cant_cuotas_pagadas = 0
        self.cuotas_impagas = 0
        self.cant_cuotas_impagas = 0


class Stock(object):

    def __init__(self):
        self.codigo = 0
        self.producto_id = 0
        self.nombre = ''
        self.cantidad = 0


class ReportesManager(models.Manager):
    def get_consumos_cliente_producto(self, cliente=None, fecha_inicio=None, fecha_termino=None):
        consulta_sql = """
            SELECT
                cliente.nombre AS cliente_nombre,
                cliente.es_lipigas AS cliente_lipigas,
                cliente.es_propio AS cliente_propio,
                descuento.monto_descuento AS descuento_monto,
                descuento.producto_id AS descuento_producto_id,
                descuento.tipo_descuento_id AS descuento_tipo,
                prod_desc.codigo AS descuento_producto_codigo,
                prod_liq.id AS producto_id,
                prod_liq.codigo AS producto_codigo,
                SUM(detalle.cantidad) AS detalle_cantidad,
                liquidacion.fecha AS liquidacion_fecha
            FROM clientes_cliente cliente
            LEFT JOIN clientes_descuentocliente descuento ON(cliente.situacion_comercial_id = descuento.id)
            LEFT JOIN bodega_producto prod_desc ON(descuento.producto_id = prod_desc.id)
            INNER JOIN liquidacion_guiaventa guiaventa ON(guiaventa.cliente_id = cliente.id)
            INNER JOIN liquidacion_detalleguiaventa detalle ON(detalle.guia_venta_id = guiaventa.id)
            INNER JOIN liquidacion_liquidacion liquidacion ON(guiaventa.liquidacion_id = liquidacion.id)
            INNER JOIN bodega_producto prod_liq ON(detalle.producto_id = prod_liq.id)
            WHERE :condiciones
            GROUP BY prod_liq.id, cliente_nombre, cliente_lipigas, cliente_propio, descuento_monto, descuento_producto_id, descuento_tipo, descuento_producto_codigo, liquidacion_fecha
            ORDER BY cliente_nombre ASC, detalle_cantidad DESC
        """

        condiciones = ['1 = 1']

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
                    'nombre': row['cliente_nombre'],
                    'tipo': None
                },
                'producto': {
                    'id': row['producto_id'],
                    'codigo': row['producto_codigo'],
                    'cantidad': row['detalle_cantidad']
                },
                'descuento': {
                    'monto': row['descuento_monto'],
                    'tipo': row['descuento_tipo'],
                    'producto': row['descuento_producto_codigo']
                },
                'liquidacion': {
                    'fecha': row['liquidacion_fecha']
                }
            }

            if row['cliente_lipigas'] and row['cliente_propio']:
                rs['cliente']['tipo'] = 'lipigas y propio'
            elif row['cliente_lipigas']:
                rs['cliente']['tipo'] = 'lipigas'
            elif row['cliente_propio']:
                rs['cliente']['tipo'] = 'propio'

            resultado.append(rs)

        return resultado

    def get_kilos_vendidos_trabajor(self, fecha_inicio=None, fecha_termino=None):
        consulta_sql = """
            SELECT
                trabajador.id AS trabajador_id,
                trabajador.apellido AS trabajador_apellido,
                trabajador.nombre AS trabajador_nombre,
                producto.codigo AS producto_codigo,
                SUM(detalle.cantidad) AS detalle_cantidad,
                SUM(producto.peso) AS producto_peso
            from trabajador_trabajador trabajador
            INNER JOIN bodega_movil movil ON(movil.trabajador_id = trabajador.id)
            INNER JOIN bodega_guiadespacho despacho ON(despacho.movil_id = movil.id)
            INNER JOIN liquidacion_liquidacion liquidacion ON(liquidacion.guia_despacho_id = despacho.id)
            INNER JOIN liquidacion_guiaventa guiaventa ON(guiaventa.liquidacion_id = liquidacion.id)
            INNER JOIN liquidacion_detalleguiaventa detalle ON(detalle.guia_venta_id = guiaventa.id)
            INNER JOIN bodega_producto producto ON(detalle.producto_id = producto.id)
            WHERE :condiciones
            GROUP BY trabajador_id, producto_codigo
            ORDER BY producto_peso DESC
        """

        condiciones = ["1 = 1"]

        if fecha_inicio is not None and fecha_termino is not None:
            condiciones.append("liquidacion.fecha BETWEEN '%s' AND '%s'" % (fecha_inicio, fecha_termino))
        elif fecha_inicio is not None:
            condiciones.append("liquidacion.fecha >= '%s'" % (fecha_inicio,))
        elif fecha_termino is not None:
            condiciones.append("liquidacion.fecha <= '%s'" % (fecha_termino,))

        consulta_sql = consulta_sql.replace(":condiciones", " AND ".join(condiciones))

        cursor = connection.cursor()
        cursor.execute(consulta_sql)
        data = dictfetchall(cursor)

        resultado = []

        for res in data:
            rs = {
                'trabajador': {
                    'id': res['trabajador_id'],
                    'apellido': res['trabajador_apellido'],
                    'nombre': res['trabajador_nombre']
                },
                'producto': {
                    'codigo': res['producto_codigo'],
                    'peso': res['producto_peso'],
                    'cantidad': res['detalle_cantidad']
                }
            }
            resultado.append(rs)

        return resultado

    def compras_gas(self, fecha_inicio=None, fecha_termino=None):
        consulta_sql = """
            SELECT
                factura.fecha as factura_fecha,
                producto.codigo as producto_codigo,
                SUM(stock.cantidad) as stock_cantidad
            FROM bodega_factura factura
            INNER JOIN bodega_historialstock stock ON(stock.factura_id = factura.id)
            INNER JOIN bodega_producto producto ON(stock.producto_id = producto.id)
            GROUP BY producto_codigo, factura_fecha
        """

        cursor = connection.cursor()
        resultado = cursor.execute(consulta_sql)
        data = []

        return data

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
