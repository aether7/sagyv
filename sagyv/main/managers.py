from django.db import models, connection
from django.db.models import Q, Sum


def dictfetchall(cursor):
    # Returns all rows from a cursor as a dict
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
            resultados = self.filter(nombre__contains=valor)
        elif opcion == "giro":
            resultados = self.filter(giro__contains=valor)
        elif opcion == "rut":
            resultados = self.filter(rut__contains=valor)
        else:
            resultados = self.all()

        return resultados


class TarjetaCreditoManager(models.Manager):
    TARJETA_CREDITO = 1
    TARJETA_DEBITO = 2
    TARJETA_COMERCIAL = 3

    def get_tarjetas_comerciales(self):
        resultados = self.filter(tipo_tarjeta_id=self.TARJETA_COMERCIAL)
        return resultados

    def get_tarjetas_bancarias(self):
        resultados = self.filter(
            Q(tipo_tarjeta_id=self.TARJETA_DEBITO) |
            Q(tipo_tarjeta_id=self.TARJETA_CREDITO)
        ).order_by("-tipo_tarjeta")

        return resultados


class GuiaDespachoManager(models.Manager):
    def get_ultimo_despacho_id(self):
        if self.exclude(numero=None).exists():
            return self.exclude(numero=None).latest('id')
        else:
            return None


class VehiculoManager(models.Manager):
    def get_vehiculos_con_chofer(self):
        return self.filter(trabajadorvehiculo__activo=1)


class BoletaTrabajadorManager(models.Manager):
    def get_talonario_activo(self, trabajador_id):
        talonarios = self.filter(trabajador_id=trabajador_id, activo=True).order_by("-id")
        return len(talonarios) > 0 and talonarios[0] or None

    def obtener_por_trabajador(self, trabajador):
        qs = self.filter(trabajador=trabajador, activo=True).order_by("-id")

        if qs.exists():
            return qs[0]
        else:
            return None


class HistorialStockManager(models.Manager):
    def get_productos_guia_recarga(self, guia):
        query = self.filter(guia_despacho=guia).values('producto_id','es_recarga','producto__codigo')
        productos = query.annotate(cantidad_total=Sum('cantidad'))
        return productos

    def get_productos_guia_total(self, guia):
        sql = """
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

        sql = sql.replace("#{guia_id}", str(guia.id))
        return self.raw(sql)


class GuiaTrabajadorManager(models.Manager):
    def obtener_guias_rango(self, guia_trabajado_id):
        sql = """
            SELECT
                gv.*
            FROM main_guiatrabajador gt
            INNER JOIN main_guiaventa gv ON(gv.numero BETWEEN gt.guia_inicial AND gt.guia_final)
            WHERE gt.id = #{guia_id}
        """

        sql = sql.replace("#{guia_id}", str(guia_trabajado_id))
        return self.raw(sql)
