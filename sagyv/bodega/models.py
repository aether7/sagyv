from django.db import models

from trabajador.models import Trabajador

from bodega.managers import GuiaDespachoManager
from bodega.managers import HistorialStockManager
from bodega.managers import VehiculoManager
from bodega.managers import StockManager
from bodega.managers import ProductoManager

# Create your models here.

class TipoProducto(models.Model):
    GARANTIA = 3
    nombre = models.CharField(max_length = 140)

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

    objects = ProductoManager()

    def __unicode__(self):
        return str(self.codigo) + " " + self.nombre

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


class PrecioProducto(models.Model):
    producto = models.ForeignKey(Producto)
    precio = models.IntegerField(null=True)
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return str(self.precio)


class Factura(models.Model):
    numero_factura = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    precio = models.IntegerField()

    def __unicode__(self):
        return str(self.numero_factura)


class Vehiculo(models.Model):
    patente = models.CharField(max_length=140)
    fecha_revision_tecnica = models.DateField()
    km = models.IntegerField()
    estado_sec = models.NullBooleanField()
    estado_pago = models.NullBooleanField()

    objects = VehiculoManager()

    def get_nombre_ultimo_chofer(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists() or trabajador_vehiculo[0].trabajador is None:
            return "No anexado"
        else:
            return trabajador_vehiculo[0].trabajador.get_nombre_completo()

    def get_ultimo_chofer(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists() or trabajador_vehiculo[0].trabajador is None:
            return None
        else:
            return trabajador_vehiculo[0].trabajador

    def get_ultimo_chofer_id(self):
        trabajador_vehiculo = TrabajadorVehiculo.objects.filter(vehiculo_id = self.id, activo = True)

        if not trabajador_vehiculo.exists() or trabajador_vehiculo[0].trabajador is None:
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


class StockVehiculo(models.Model):
    vehiculo = models.ForeignKey(Vehiculo)
    producto = models.ForeignKey(Producto)
    cantidad = models.IntegerField(null = True)

    objects = StockManager()

    def get_productos_vehiculos(self):
        stocks_vehiculos = StockVehiculo.objects.filter(producto = self.producto, vehiculo = self.vehiculo)
        return stocks_vehiculos

    def __unicode__(self):
        return str(self.vehiculo.patente) + " -> (cod " + str(self.producto.codigo) + ": " + str(self.cantidad) + ")"


class TrabajadorVehiculo(models.Model):
    trabajador = models.ForeignKey(Trabajador, null = True)
    vehiculo = models.ForeignKey(Vehiculo)
    fecha = models.DateTimeField(auto_now_add = True)
    activo = models.BooleanField(default = True)

    def __unicode__(self):
        return self.trabajador.nombre + ", " + self.vehiculo.patente


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


class Movil(models.Model):
    numero = models.IntegerField(null = True)
    trabajador = models.ForeignKey(Trabajador, null = True)
    vehiculo = models.ForeignKey(Vehiculo, unique = True)
    fecha = models.DateTimeField(auto_now_add = True, auto_now = True)

    def __unicode__(self):
        return str(self.numero) + " " + str(self.vehiculo.id)


class GuiaDespacho(models.Model):
    numero = models.IntegerField(null = True)
    movil = models.ForeignKey(Movil)
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


class HistorialStock(models.Model):
    guia_despacho = models.ForeignKey(GuiaDespacho, null=True)
    factura = models.ForeignKey(Factura, null = True)
    producto = models.ForeignKey(Producto)
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now_add = True)
    es_recarga = models.NullBooleanField()

    objects = HistorialStockManager()

    def __unicode__(self):
        return ""
