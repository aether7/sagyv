from django.db import models

class Trabajador(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre

class TipoEntrega(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Region(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Comuna(models.Model):
    nombre = models.CharField(max_length=140)
    region = models.ForeignKey(Region)

    def __unicode__(self):
        return self.nombre


class FormatoProducto(models.Model):
    nombre = models.CharField(max_length=140)
    peso = IntegerField()

    def __unicode__(self):
        return self.nombre

class Cliente(models.Model):
    nombre = models.CharField(max_length=140)
    direccion = models.TextField()
    telefono = models.CharField(max_length=140)
    rut = models.CharField(max_length=140)
    razon_social = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre + " " + self.telefono


class Cupon(models.Model):
    fecha = models.DateField(auto_now_add=True)
    numero_cupon = models.IntegerField(unique=True)
    cliente = models.ForeignKey(Cliente)
    formato = models.ForeignKey(FormatoProducto)
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return str(self.numero_cupon)


class TipoPago(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TipoTarjeta(models.Model):
    nombre = models.CharField(max_length=140)
    marca = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class BoletaPago(models.Model):
    tipo_tarjeta = models.ForeignKey(TipoTarjeta, null=True)
    tipo_pago = models.ForeignKey(TipoPago)
    tipo_cuotas = models.CharField(max_length=140,null=True)
    fecha = models.DateTimeField()
    terminal = models.CharField(max_length=140)
    numero_tarjeta = models.IntegerField(null=True)
    numero_operacion = models.IntegerField()
    codigo_autorizacion = models.IntegerField()
    numero_cuotas = models.IntegerField(default=1)
    monto = models.IntegerField()

    def __unicode__(self):
        return ""


class CuotasBoleta(models.Model):
    boleta_pago = models.ForeignKey(BoletaPago)
    monto = models.IntegerField()

    def __unicode__(self):
        return self.monto


class CierreRepartidor(models.Model):
    numero_cierre = models.IntegerField()
    fecha = models.DateTimeField()
    correlativo_cierre = models.IntegerField()
    chofer = models.ForeignKey(Trabajador)
    total_descuentos = IntegerField()


class TargetaComercial(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


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


class DescuentoCliente(models.Model):
    nombre = models.ForeignKey(Cliente)
    


class GuiaDespasho(models.Model):
    cliente = models.ForeignKey(Cliente)
    chofer = models.ForeignKey(Trabajador)
    numero = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    sub_total = models.IntegerField()
    descuento_cliente = models.ForeignKey()

    def __unicode__(self):
        return self.numero

