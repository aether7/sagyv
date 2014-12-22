#-*- coding: utf-8 -*-

import json

from django.db import models
from django.contrib.auth.models import User

from main.managers import StockManager
from main.managers import ClienteManager
from main.managers import TarjetaCreditoManager
from main.managers import GuiaDespachoManager
from main.managers import VehiculoManager
from main.managers import TrabajadorManager
from main.managers import BoletaTrabajadorManager
from main.managers import HistorialStockManager

"""
Como nota adicional: Todos los ingresos que sean representados como booleanos
las columnas con valor 1 son entradas al sistema, mientras que los 0 seran representados
como salidas del sistema
"""

class Region(models.Model):
    nombre = models.CharField(max_length=140)
    orden = models.IntegerField(null = True)

    def __unicode__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "regiones"


class Comuna(models.Model):
    nombre = models.CharField(max_length=140)
    region = models.ForeignKey(Region)

    def __unicode__(self):
        return self.nombre


class Herramienta(models.Model):
    nombre = models.CharField(max_length=140)
    stock = models.IntegerField()

    def __unicode__(self):
        return self.nombre


class Filtro(models.Model):
    nombre = models.CharField(max_length=140)
    km_cambio = models.IntegerField()

    def __unicode__(self):
        return self.nombre


class Vehiculo(models.Model):
    patente = models.CharField(max_length=140)
    fecha_revision_tecnica = models.DateField()
    km = models.IntegerField()
    estado_sec = models.NullBooleanField()
    estado_pago = models.NullBooleanField()

    objects = VehiculoManager()

    def get_nombre_ultimo_chofer(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists():
            return "No anexado"
        else:
            return trabajador_vehiculo[0].trabajador.get_nombre_completo()

    def get_ultimo_chofer(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists():
            return None
        else:
            return trabajador_vehiculo[0].trabajador

    def get_ultimo_chofer_id(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists():
            return 0
        else:
            return trabajador_vehiculo[0].trabajador.id

    def get_estado_ultima_guia(self):
        queryset = GuiaDespacho.objects.filter(vehiculo_id = self.id)
        ultima_guia = queryset.latest("id")

        return ultima_guia.estado

    def get_numero_movil(self):
        if Movil.objects.filter(vehiculo = self).exists():
            return Movil.objects.get(vehiculo = self).numero
        else:
            return None

    def __unicode__(self):
        return self.patente


class PagoVehiculo(models.Model):
    vehiculo = models.ForeignKey(Vehiculo)
    cantidad_cuotas = models.IntegerField()
    valor_cuota = models.IntegerField()

    def __unicode__(self):
        return ""


class PagoCuotaVehiculo(models.Model):
    pagoVehiculo = models.ForeignKey(PagoVehiculo)
    numero_cuota = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return ""


class Mantencion(models.Model):
    vehiculo = models.ForeignKey(Vehiculo)
    fecha = models.DateField(auto_now_add=True)
    km = models.IntegerField()
    descripcion = models.CharField(max_length=500)

    def __unicode__(self):
        return self.fecha + ' : ' + self.vehiculo


class CambioFiltro(models.Model):
    mantencion = models.ForeignKey(Mantencion)
    filtro = models.ForeignKey(Filtro)
    km_cambio = models.IntegerField()

    def __unicode__(self):
        return self.estado


class CambioAceite(models.Model):
    mantencion = models.ForeignKey(Mantencion)
    km_cambio = models.IntegerField()

    def __unicode__(self):
        return self.estado


class Afp(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class SistemaSalud(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "sistemas salud"


class EstadoCivil(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class EstadoVacacion(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "estados de vacaciones"


class Trabajador(models.Model):
    nombre = models.CharField(max_length = 140)
    apellido = models.CharField(max_length = 140)
    rut = models.CharField(max_length = 140)
    domicilio = models.CharField(max_length = 140, null = True, blank = True)
    nacimiento = models.DateField(null = True, blank = True)
    fecha_inicio_contrato = models.DateField(null = True, blank = True)
    vigencia_licencia = models.DateField(null = True, blank = True)
    afp = models.ForeignKey(Afp,null = True,blank = True)
    sistema_salud = models.ForeignKey(SistemaSalud,null = True, default = 1)
    estado_civil = models.ForeignKey(EstadoCivil,null = True, default = 1)

    objects = TrabajadorManager()

    def get_nombre_completo(self):
        return self.nombre + " " + self.apellido

    def get_json(self):
        data = {
            "id" : self.id,
            "nombre" : self.nombre,
            "apellido" : self.apellido,
            "rut" : self.rut,
            "dv" : self.dv
        }

        return json.dumps(data)

    def get_vacacion(self):
        ultima_vacacion = self.vacacion_set.order_by("-id")[0]

        return ultima_vacacion.__unicode__()

    def get_id_vacacion(self):
        ultima_vacacion = self.vacacion_set.order_by("-id")[0]

        return ultima_vacacion.estado_vacacion.id

    def __unicode__(self):
        return self.nombre + ' ' + self.apellido

    class Meta:
        verbose_name_plural = "trabajadores"


class Vacacion(models.Model):
    trabajador = models.ForeignKey(Trabajador)
    estado_vacacion = models.ForeignKey(EstadoVacacion)
    fecha_inicio = models.DateField(null=True)
    dias_restantes = models.IntegerField(null=True)
    activo = models.NullBooleanField()

    def __unicode__(self):
        return  self.estado_vacacion.nombre


class CargaFamiliar(models.Model):
    nombre = models.CharField(max_length=140, null=True)
    edad = models.IntegerField()
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return self.edad


class HerramientaTrabajador(models.Model):
    trabajador = models.ForeignKey(Trabajador)
    herramienta = models.ForeignKey(Herramienta)
    fecha_entrega = models.DateField(auto_now_add=True)
    fecha_retorno = models.DateField(null=True)

    def __unicode__(self):
        return self.herramienta.nombre


class TrabajadorVehiculo(models.Model):
    trabajador = models.ForeignKey(Trabajador, null = True)
    vehiculo = models.ForeignKey(Vehiculo)
    fecha = models.DateTimeField(auto_now_add = True)
    activo = models.BooleanField(default = True)

    def __unicode__(self):
        return self.trabajador.nombre + ", " + self.vehiculo.patente


class TipoProducto(models.Model):
    GARANTIA = 3
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Producto(models.Model):
    codigo = models.IntegerField()
    nombre = models.CharField(max_length = 140)
    peso = models.IntegerField(null = True)
    tipo_producto = models.ForeignKey(TipoProducto)
    stock = models.IntegerField(default = 0)
    nivel_critico = models.IntegerField(null = True)
    orden =  models.IntegerField(default = 0)

    def __unicode__(self):
        return str(self.codigo) + " " +self.nombre

    def get_precio_producto(self):
        ultimo_precio = PrecioProducto.objects.filter(producto_id = self.id).order_by("-id")
        precio = 0

        if len(ultimo_precio) >= 1:
            precio = ultimo_precio[0].precio

        return precio

    def get_nombre_tipo(self):
        return self.nombre + " " + self.tipo_producto.nombre

    def get_clase_nivel_alerta(self):
        clase_alerta = "text-"

        if self.nivel_critico is None:
            nivel_critico = 50
        else:
            nivel_critico = self.nivel_critico

        if self.stock <= nivel_critico:
            clase_alerta += "danger"
        else:
            clase_alerta += "success"

        if self.es_garantia():
            clase_alerta = ""

        return clase_alerta

    def es_garantia(self):
        return self.tipo_producto_id == TipoProducto.GARANTIA


class TipoCambioStock(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class GuiaDespacho(models.Model):
    numero = models.IntegerField(null = True)
    vehiculo = models.ForeignKey(Vehiculo, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    valor_total = models.IntegerField(default=0)
    estado = models.NullBooleanField()

    objects = GuiaDespachoManager()

    def __unicode__(self):
        return str(self.numero)


class AbonoGuia(models.Model):
    guia_despacho = models.ForeignKey(GuiaDespacho)
    monto = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return str(self.guia_despacho.numero)


class Factura(models.Model):
    numero_factura = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    precio = models.IntegerField()

    def __unicode__(self):
        return str(self.numero_factura)


class HistorialStock(models.Model):
    guia_despacho = models.ForeignKey(GuiaDespacho, null=True)
    factura = models.ForeignKey(Factura, null=True)
    producto = models.ForeignKey(Producto)
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add = True)
    es_recarga = models.NullBooleanField()

    objects = HistorialStockManager()

    def __unicode__(self):
        return ""


class TipoTarjeta(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Banco(models.Model):
    nombre = models.CharField(max_length = 255)
    cheques_recibidos = models.IntegerField(default = 0)

    def __unicode__(self):
        return self.nombre


class TarjetaCredito(models.Model):
    nombre = models.CharField(max_length=140)
    codigo = models.CharField(max_length=140, null=True)
    tipo_tarjeta = models.ForeignKey(TipoTarjeta)

    objects = TarjetaCreditoManager()

    def __unicode__(self):
        return self.nombre + " " + self.codigo

    class Meta:
        verbose_name_plural = "tarjetas credito"


class TipoPago(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TipoDescuento(models.Model):
    tipo = models.CharField(max_length=140)

    def __unicode__(self):
        return self.tipo


class DescuentoCliente(models.Model):
    monto_descuento = models.IntegerField()
    tipo_descuento = models.ForeignKey(TipoDescuento)
    producto = models.ForeignKey(Producto, null=True)

    def es_cliente_sin_descuento(self):
        return self.tipo_descuento.id == 1

    def get_json_string(self):
        if self.id == 1:
            return "Sin descuento"

        if self.tipo_descuento.id == 1:
            texto = "$ " + str(self.monto_descuento) + " (" + str(self.producto.codigo) + ")"
        else:
            texto = str(self.monto_descuento) + " % (" + str(self.producto.codigo) + ")"

        return texto

    def __unicode__(self):
        if self.id == 1:
            return unicode("Sin descuento")
        else:
            tipo = self.tipo_descuento.id == 1 and "$" or "%"
            producto = self.producto.nombre + " " + self.producto.tipo_producto.nombre
            texto = "%s %s en %s" % (tipo, self.monto_descuento, producto)

            return unicode(texto)


class Cliente(models.Model):
    nombre = models.CharField(max_length=140)
    giro = models.CharField(max_length=140)
    direccion = models.TextField()
    telefono = models.CharField(max_length=140, null=True)
    rut = models.CharField(max_length=140)
    situacion_comercial = models.ForeignKey(DescuentoCliente)
    credito = models.NullBooleanField()
    dispensador = models.NullBooleanField()
    es_lipigas = models.NullBooleanField()
    es_propio = models.NullBooleanField()
    observacion = models.CharField(max_length=500, null=True)

    objects = ClienteManager()

    def __unicode__(self):
        return self.nombre + " " + self.telefono


class PrecioProducto(models.Model):
    producto = models.ForeignKey(Producto)
    precio = models.IntegerField(null=True)
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return str(self.precio)


class StockVehiculo(models.Model):
    vehiculo = models.ForeignKey(Vehiculo)
    producto = models.ForeignKey(Producto)
    cantidad = models.IntegerField(null=True)

    objects = StockManager()

    def get_productos_vehiculos(self):
        stocks_vehiculos = StockVehiculo.objects.filter(producto = self.producto, vehiculo = self.vehiculo)
        return stocks_vehiculos

    def __unicode__(self):
        return str(self.vehiculo.patente) + " -> (cod " + str(self.producto.codigo) + ": " + str(self.cantidad) + ")"


class LogSistema(models.Model):
    CREAR = 1
    ACTUALIZAR = 2
    BORRAR = 3
    descripcion = models.TextField(null = True)
    fecha = models.DateTimeField(auto_now_add = True)
    tipo_accion = models.IntegerField()
    user = models.ForeignKey(User)
    tabla = models.CharField(max_length = 140)
    registro_id = models.IntegerField()


class BoletaTrabajador(models.Model):
    boleta_inicial = models.IntegerField(default = 1)
    boleta_final = models.IntegerField(default = 2)
    actual = models.IntegerField(default = 1)
    trabajador = models.ForeignKey(Trabajador)
    fecha_creacion = models.DateTimeField(auto_now_add = True)
    fecha_modificacion = models.DateTimeField(auto_now = True)
    activo = models.NullBooleanField()

    objects = BoletaTrabajadorManager()


class Liquidacion(models.Model):
    fecha = models.DateTimeField(auto_now_add = True)
    guia_despacho = models.ForeignKey(GuiaDespacho)
    terminada = models.BooleanField(default = False)


class GuiaVenta(models.Model):
    cliente = models.ForeignKey(Cliente)
    propia = models.NullBooleanField()
    liquidacion = models.ForeignKey(Liquidacion)


class DetalleGuiaVenta(models.Model):
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto)
    guia_venta = models.ForeignKey(GuiaVenta)


class Cheque(models.Model):
    monto = models.IntegerField()
    emisor = models.ForeignKey(Cliente, null = True)
    fecha = models.DateField()
    numero = models.IntegerField()
    cobrado = models.BooleanField(default = False)
    banco = models.ForeignKey(Banco)
    liquidacion = models.ForeignKey(Liquidacion)

    def __unicode__(self):
        return str(self.numero) + ' ' + str(self.monto)


class Otros(models.Model):
    concepto = models.CharField(max_length = 255)
    monto = models.IntegerField()
    fecha = models.DateField(auto_now = True)
    trabajador = models.ForeignKey(Trabajador)
    liquidacion = models.ForeignKey(Liquidacion)

    def __unicode__(self):
        return str(self.fecha) + ' ' + str(self.trabajador.get_nombre_completo)


class CuponPrepago(models.Model):
    numero_cupon = models.IntegerField()
    fecha = models.DateField(auto_now_add = True)
    descuento = models.IntegerField()
    formato = models.ForeignKey(Producto)
    cliente = models.ForeignKey(Cliente)
    liquidacion = models.ForeignKey(Liquidacion)

    def __unicode__(self):
        return self.numero_cupon


class Movil(models.Model):
    numero = models.IntegerField(null = True)
    trabajador = models.ForeignKey(Trabajador, null = True)
    vehiculo = models.ForeignKey(Vehiculo, unique = True)
    fecha = models.DateTimeField(auto_now_add = True, auto_now = True)


class EstadoTerminal(models.Model):
    ACTIVO = 1
    MANTENCION = 2
    RETIRADO = 3

    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Terminal(models.Model):
    codigo = models.CharField(max_length=140)
    movil = models.ForeignKey(Movil, null = True)
    estado = models.ForeignKey(EstadoTerminal)

    def __unicode__(self):
        return self.codigo


class HistorialEstadoTerminal(models.Model):
    terminal = models.ForeignKey(Terminal)
    estado = models.ForeignKey(EstadoTerminal)
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.terminal.codigo + "(" + self.estado + ") " + self.fecha


class HistorialCambioVehiculo(models.Model):
    terminal = models.ForeignKey(Terminal)
    movil = models.ForeignKey(Movil, null = True)
    fecha = models.DateField(auto_now_add = True)
    estado = models.NullBooleanField()

    def __unicode__(self):
        return self.terminal.codigo + "(" + ") " + self.fecha


class Cierre(models.Model):
    fecha = models.DateField(auto_now_add=True)
    correlativo_cierre = models.IntegerField()
    numero_cierre = models.IntegerField(null=True)
    terminal = models.ForeignKey(Terminal)

    def __unicode__(self):
        return self.correlativo_cierre


class DetalleCierre(models.Model):
    cantidad_ventas = models.IntegerField(default=0)
    cantidad_anuladas = models.IntegerField(default=0)
    valor_venta = models.IntegerField(default=0)
    valor_anuladas = models.IntegerField(default=0)
    cierre = models.ForeignKey(Cierre)

    def __unicode__(self):
        return self.id + " " + self.valor_venta

    def get_valor_total(self):
        return self.valor_venta - self.valor_anuladas


class Voucher(models.Model):
    tipo_tarjeta = models.ForeignKey(TipoTarjeta, null = True)
    tipo_cuotas = models.CharField(max_length = 140, null = True)
    terminal = models.ForeignKey(Terminal)
    numero_tarjeta = models.IntegerField(null = True)
    numero_operacion = models.IntegerField(null = True)
    codigo_autorizacion = models.IntegerField(null = True)
    numero_cuotas = models.IntegerField(default = 1)
    liquidacion = models.ForeignKey(Liquidacion)

    def __unicode__(self):
        return self.monto


class CuotaVoucher(models.Model):
    voucher = models.ForeignKey(Voucher)
    monto = models.IntegerField()
    pagado = models.NullBooleanField()
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.monto
