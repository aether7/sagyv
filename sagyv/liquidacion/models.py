from django.db import models

from bodega.models import GuiaDespacho
from bodega.models import Producto
from bodega.models import Movil
from clientes.models import Cliente
from trabajador.models import Trabajador
from liquidacion.managers import TarjetaCreditoManager
from liquidacion.managers import TerminalManager

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

    objects = TerminalManager()

    def __unicode__(self):
        return self.codigo


class HistorialEstadoTerminal(models.Model):
    terminal = models.ForeignKey(Terminal)
    estado = models.ForeignKey(EstadoTerminal)
    fecha = models.DateField(auto_now_add = True)

    def __unicode__(self):
        return self.terminal.codigo + "(" + self.estado + ") " + self.fecha


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


class Liquidacion(models.Model):
    fecha = models.DateTimeField(auto_now_add = True)
    guia_despacho = models.ForeignKey(GuiaDespacho)
    terminada = models.BooleanField(default = False)


class GuiaVenta(models.Model):
    numero = models.IntegerField(null = True)
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


class HistorialCambioVehiculo(models.Model):
   terminal = models.ForeignKey(Terminal)
   movil = models.ForeignKey(Movil, null = True)
   fecha = models.DateField(auto_now_add = True)
   estado = models.NullBooleanField()

   def __unicode__(self):
       return self.terminal.codigo + "(" + ") " + self.fecha
