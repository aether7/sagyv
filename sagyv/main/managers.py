from django.db import connections, models, connection
from django.db.models import Q, Sum
from main import trabajador

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

    ###TODO: agregar fechas en un between en la consulta
    def get_consumos_cliente_producto(self,cliente = None, fecha_inicio = None, fecha_termino = None):

        consulta_sql = """
            SELECT
                c.id as cliente_id,
                c.rut as cliente_rut,
                c.nombre as cliente_nombre,
                c.es_lipigas as cliente_lipigas,
                c.es_propio as cliente_propio,
                c.credito as cliente_credito
            FROM main_cliente c
        """

        condiciones = []

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

            resultado.append(fila)

            # fila.id_cliente = row['id_cliente']
            # fila.nombre_cliente = row['nombre_cliente']
            # fila.rut_cliente = row['rut_cliente']
            # fila.es_lipigas = row['es_lipigas_cliente']
            # fila.es_propio = row['es_propio_cliente']
            # fila.credito = row['tiene_credito_cliente']
            # fila.monto_descuento = row['descuento_sc']
            # fila.tipo_descuento = row['tipo_descuento']
            # fila.id_producto = row['id_producto']
            # fila.codigo_producto = row['codigo_producto']
            # fila.cantidad_producto = row['cantidad_producto']

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
            GROUP BY mp.codigo, mp.peso, msv.producto_id, mtp.nombre
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
                    (SELECT SUM(cantidad) FROM main_stockvehiculo WHERE producto_id = mp.id) as cantidad,
                    mp.id
            FROM main_producto mp
            INNER JOIN main_tipoproducto mtp ON(mp.tipo_producto_id = mtp.id)
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


class ClienteManager(models.Manager):
    def busqueda_por_campo(self, valor, opcion):

        if opcion == "nombre":
            resultados = self.filter(nombre__contains = valor)
        elif opcion == "giro":
            resultados = self.filter(giro__contains = valor)
        elif opcion == "rut":
            resultados = self.filter(rut__contains = valor)
        else:
            resultados = self.all()

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


class GuiaDespachoManager(models.Manager):
    def get_ultimo_despacho_id(self):
        if self.exclude(numero = None).exists():
            return self.exclude(numero = None).latest('id')
        else:
            return None


class VehiculoManager(models.Manager):
    def get_vehiculos_con_chofer(self):
        return self.filter(trabajadorvehiculo__activo = 1)


class TrabajadorManager(models.Manager):
    pass


class BoletaTrabajadorManager(models.Manager):
    def get_talonario_activo(self, trabajador_id):
        talonarios = self.filter(trabajador_id = trabajador_id, activo = True).order_by("-id")

        return len(talonarios) > 0 and talonarios[0] or None

    def obtener_por_trabajador(self, trabajador):
        qs = self.filter(trabajador=trabajador, activo=True).order_by("-id")

        if qs.exists():
            return qs[0]
        else:
            return None


class HistorialStockManager(models.Manager):
    def get_productos_guia_recarga(self, guia):
        query = self.filter(guia_despacho = guia).values('producto_id','es_recarga','producto__codigo')
        productos = query.annotate(cantidad_total = Sum('cantidad'))

        return productos

    def get_productos_guia_total(self, guia):
        query = """
            SELECT
                id,
                fecha,
                guia_despacho_id,
                producto_id,
                factura_id,
                es_recarga,
                SUM(cantidad) as cantidad
            FROM main_historialstock
            WHERE guia_despacho_id = #{guia_id}
            GROUP BY producto_id, id
        """

        query = query.replace("#{guia_id}", str(guia.id))
        return self.raw(query)
