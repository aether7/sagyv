from django.db import models

from clientes.managers import ClienteManager
from bodega.models import Producto

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
