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


class Cliente(models.Model):
    nombre = models.CharField(max_length=140)
    direccion = models.TextField()
    telefono = models.CharField(max_length=140)
    rut = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre + " " + self.telefono


class Cupon(models.Model):
    modalidad_reparto = models.ForeignKey(TipoEntrega)
    razon_social = models.CharField(max_length=140)
    numero_cupon = models.IntegerField(unique=True)
    numero_factura = models.IntegerField(unique=True)
    fecha = models.DateField(auto_now_add=True)
    lugar_emision = models.CharField(max_length=200)
    detalle = models.TextField()
    zonal = models.ForeignKey(Comuna)
    cantidad_kilos = models.IntegerField()
    cliente = models.ForeignKey(Cliente)
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return str(self.numero_cupon) + " " + self.zonal.nombre


class TipoPago(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TipoTarjeta(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class BoletaPago(models.Model):
    tipo_pago = models.ForeignKey(TipoPago)
    fecha = models.DateTimeField()
    terminal = models.CharField(max_length=140)
    fecha_contable = models.DateField()
    monto = models.IntegerField()
    numero_operacion = models.IntegerField()
    codigo_autorizacion = models.IntegerField()
    numero_tarjeta = models.IntegerField(null=True)
    tipo_tarjeta = models.ForeignKey(TipoTarjeta, null=True)
    numero_cuenta = models.IntegerField(null=True)
    marca = models.CharField(max_length=140,null=True)
    tipo_cuotas = models.CharField(max_length=140,null=True)
    numero_cuotas = models.IntegerField(default=1)

    def __unicode__(self):
        return ""


class CuotasBoleta(models.Model):
    boleta_pago = models.ForeignKey(BoletaPago)
    monto = models.IntegerField()

    def __unicode(self):
        return self.monto

class CierreRepartidor(models.Model):
    chofer = models.ForeignKey(Trabajador)
    fecha = models.DateTimeField()
    oficina = models.IntegerField()
    terminal = models.IntegerField()
    numero_cierre = models.IntegerField()
