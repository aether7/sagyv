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
    razon_social = models.CharField(max_length=140)
    fecha = models.DateField(auto_now_add=True)
    formato = models.IntegerField()
    numero_cupon = models.IntegerField(unique=True)
    cliente = models.ForeignKey(Cliente)
    numero_factura = models.IntegerField(unique=True)
    #lugar_emision = models.CharField(max_length=200)
    #detalle = models.TextField()
    #zonal = models.ForeignKey(Comuna)
    #cantidad_kilos = models.IntegerField()
    #modalidad_reparto = models.ForeignKey(TipoEntrega)
    #trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return str(self.numero_cupon)


class TipoPago(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TipoTarjeta(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class BoletaPago(models.Model):
    marca = models.CharField(max_length=140,null=True) #se deberia hacer una tabla con marca.(dependiendo de la marca tener el tipo)
    tipo_pago = models.ForeignKey(TipoPago)
    tipo_cuotas = models.CharField(max_length=140,null=True)
    fecha = models.DateTimeField()
    terminal = models.CharField(max_length=140)
    numero_tarjeta = models.IntegerField(null=True)
    numero_operacion = models.IntegerField()
    codigo_autorizacion = models.IntegerField()
    numero_cuotas = models.IntegerField(default=1)
    monto = models.IntegerField()
    
    #fecha_contable = models.DateField()
    #tipo_tarjeta = models.ForeignKey(TipoTarjeta, null=True) -> me surge la duda por que existe este...
    #numero_cuenta = models.IntegerField(null=True)

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
