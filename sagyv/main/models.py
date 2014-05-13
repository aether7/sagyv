from django.db import models

class Region(models.Model):
    nombre = models.CharField(max_length=140)
    orden = models.IntegerField()

    def __unicode__(self):
        return self.nombre


class Comuna(models.Model):
    nombre = models.CharField(max_length=140)
    region = models.ForeignKey(Region)

    def __unicode__(self):
        return self.nombre


class Vehiculo(models.Model):
    patente = models.CharField(max_length=140)

    def __unicode__(self):
        return self.patente


class Trabajador(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TrabajadorVehiculo(models.Model):
    trabajador = models.ForeignKey(Trabajador)
    vehiculo = models.ForeignKey(Vehiculo)
    fecha = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __unicode__(self):
        return self.trabajador.nombre + ", " + self.vehiculo.patente


class TipoProducto(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Producto(models.Model):
    codigo = models.IntegerField()
    nombre = models.CharField(max_length=140)
    peso = models.IntegerField(null=True)
    tipo_producto = models.ForeignKey(TipoProducto)

    def __unicode__(self):
        return str(self.codigo) + " " +self.nombre


class TipoTarjeta(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TarjetaCredito(models.Model):
    nombre = models.CharField(max_length=140)
    codigo = models.CharField(max_length=140, null=True)
    tipo_tarjeta = models.ForeignKey(TipoTarjeta)

    def __unicode__(self):
        return self.nombre + " " + self.codigo


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

    def __unicode__(self):
        return self.monto_descuento


class Cliente(models.Model):
    giro = models.CharField(max_length=140)
    direccion = models.TextField()
    telefono = models.CharField(max_length=140)
    rut = models.CharField(max_length=140)
    situacion_comercial = models.ForeignKey(DescuentoCliente)
    credito = models.IntegerField(null=True)

    def __unicode__(self):
        return self.nombre + " " + self.telefono


class Terminal(models.Model):
    codigo = models.CharField(max_length=140)
    vehiculo = models.ForeignKey(Vehiculo)

    def __unicode__(self):
        return self.codigo


class Voucher(models.Model):
    tipo_tarjeta = models.ForeignKey(TipoTarjeta, null=True)
    tipo_pago = models.ForeignKey(TipoPago)
    tipo_cuotas = models.CharField(max_length=140,null=True)
    fecha = models.DateTimeField()
    terminal = models.ForeignKey(Terminal)
    numero_tarjeta = models.IntegerField(null=True)
    numero_operacion = models.IntegerField()
    codigo_autorizacion = models.IntegerField()
    numero_cuotas = models.IntegerField(default=1)
    monto = models.IntegerField()
    cliente = models.ForeignKey(Cliente)
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return self.monto


class CuotaVoucher(models.Model):
    voucher = models.ForeignKey(Voucher)
    monto = models.IntegerField()
    pagado = models.NullBooleanField()

    def __unicode__(self):
        return self.monto


class Cupon(models.Model):
    numero_cupon = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente)
    producto = models.ForeignKey(Producto)
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return self.numero_cupon


"""

class CierreRepartidor(models.Model):
    numero_cierre = models.IntegerField()
    fecha = models.DateTimeField()
    correlativo_cierre = models.IntegerField()
    chofer = models.ForeignKey(Trabajador)
    total_descuentos = models.IntegerField()


class TipoDescuento(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class DetalleTargetaCierreRepartidor(models.Model):
    cierre = models.ForeignKey(CierreRepartidor)
    targeta_comercial = models.ForeignKey(TargetaComercial)
    monto_total = models.IntegerField()

    def __unicode__(self):
        return ""


class DetalleDescuentoCierreRepartidor(models.Model):
    cierre = models.ForeignKey(CierreRepartidor)
    tipo_descuento = models.ForeignKey(TipoDescuento)
    monto_total = models.IntegerField()

    def __unicode__(self):
        return ""



class Proveedor(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class GuiaDespasho(models.Model):
    cliente = models.ForeignKey(Cliente)
    chofer = models.ForeignKey(Trabajador)
    numero = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    sub_total = models.IntegerField()
    descuento_cliente = models.ForeignKey(DescuentoCliente)
    proveedor = models.ForeignKey(Proveedor)


    def __unicode__(self):
        return self.numero


class Vale(models.Model):
    numero = models.IntegerField()
    nombre_establecimito = models.CharField(max_length=140)
    formato = models.ForeignKey(FormatoProducto)
    guia_despasho = models.ForeignKey(GuiaDespasho)

    def __unicode__(self):
        return self.numero
"""
