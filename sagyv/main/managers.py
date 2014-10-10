from django.db import connection, models
from django.db.models import Q, Sum
from main import trabajador


class ReportesManager(models.Manager):

    ###TODO: agregar fechas en un between en la consulta

    def get_consumos_cliente_producto(self,fecha_inicio = None, fecha_termino = None):

        consulta_sql = """
            SELECT
                main_cliente.id,
                main_cliente.nombre,
                main_detalleventa.producto_id,
                SUM(main_detalleventa.monto)
           FROM main_cliente INNER JOIN main_venta ON main_cliente.id = main_venta.cliente_id
           LEFT JOIN main_detalleventa ON main_venta.id = main_detalleventa.venta_id
           GROUP BY main_cliente.id, main_cliente.nombre, main_detalleventa.producto_id"""

        query = connection.cursor()
        query.execute(consulta_sql)

        resultado = []

        for row in query.fetchall():
            fila = ConsumoCliente()
            fila.id_cliente = row[0]
            fila.nombre = row[1]
            fila.id_producto = row[2]
            fila.suma_monto = row[3]

            resultado.append(fila)

        return resultado

    def get_kilos_vendidos_trabajor(self, fecha_inicio=None, fecha_termino=None):


        consulta_sql = """
                           SELECT trabajador.id, trabajador.nombre,  producto.id, producto.nombre ,
                                  producto.peso, sum(detalle_v.cantidad) * producto.peso as kilos

                            FROM main_trabajador trabajador
                                      JOIN main_venta venta on venta.trabajador_id = trabajador.id
                                      JOIN main_detalleventa detalle_v on venta.id = detalle_v.venta_id
                                      LEFT  JOIN main_producto producto  on producto.id = detalle_v.producto_id
                                      JOIN main_tipoproducto tipo_p on producto.tipo_producto_id = tipo_p.id
                             GROUP BY trabajador.id, trabajador.nombre,tipo_p.nombre, producto.id, producto.nombre ,  producto.peso
        """

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

            resultado.append(fila)

        return resultado

    def detalle_cuotas_creditos(self, fecha_inicio = None, fecha_termino = None):

        consulta_sql = """
                SELECT venta.id, venta.numero_serie, venta.monto ,
                       venta.fecha, venta.cliente_id, cliente.nombre   , voucher.tipo_cuotas,
                       voucher.numero_tarjeta, voucher.numero_operacion, voucher.numero_cuotas,
                       (
                            SELECT sum(cuota_pagada.monto)
                            FROM main_cuotavoucher cuota_pagada
                            WHERE
                                 voucher.id = cuota_pagada.voucher_id AND
                                 cuota_pagada.pagado = 1
                        )  as pagada,
                        (
                           SELECT count(cuota_pagada.id)
                           FROM main_cuotavoucher cuota_pagada
                           WHERE
                           voucher.id = cuota_pagada.voucher_id AND
                           cuota_pagada.pagado = 1

                        )  as cant_cp,
                        (
                          SELECT sum(cuota_impagada.monto)
                          FROM main_cuotavoucher cuota_impagada
                          WHERE
                          voucher.id = cuota_impagada.voucher_id AND
                          cuota_impagada.pagado = 0
                        )  as impaga,
                        (
                          SELECT count(cuota_impagada.id)
                          FROM main_cuotavoucher cuota_impagada
                          WHERE
                            voucher.id = cuota_impagada.voucher_id AND
                            cuota_impagada.pagado = 0
                        )  as cant_cimp
                 FROM main_venta venta

                 INNER JOIN main_voucher voucher ON venta.id = voucher.venta_id
                 INNER JOIN main_cliente cliente ON cliente.id = venta.cliente_id

                 GROUP BY venta.id, venta.numero_serie, venta.monto , venta.fecha,
                          venta.cliente_id, cliente.nombre, voucher.tipo_cuotas,
                          voucher.numero_tarjeta, voucher.numero_operacion, voucher.numero_cuotas
                 ORDER BY cliente.nombre
                          """

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
        producto_peso = 0
        suma_kilos = 0

class ConsumoCliente(object):

    def __init__(self):
        self.id_cliente = 0
        self.nombre = ""
        self.id_producto = 0
        self.suma_monto = 0

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
                    (SELECT SUM(cantidad) FROM main_stockvehiculo WHERE producto_id = mp.id) as cantidad,
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
