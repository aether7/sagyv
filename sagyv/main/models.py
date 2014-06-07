import json
from django.db import models

class Region(models.Model):
    nombre = models.CharField(max_length=140)
    orden = models.IntegerField()

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
    estado_sec = models.BooleanField(default=True)
    estado_pago = models.BooleanField(default=True)

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


class Isapre(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class EstadoCivil(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Trabajador(models.Model):
    nombre = models.CharField(max_length=140)
    apellido = models.CharField(max_length=140)
    rut = models.IntegerField()
    dv = models.CharField(max_length=1)
    domicilio = models.CharField(max_length=140,null=True,blank=True)
    nacimiento = models.DateField(null=True,blank=True)
    fecha_inicio_contrato = models.DateField(null=True,blank=True)
    vigencia_licencia = models.DateField(null=True,blank=True)
    afp = models.ForeignKey(Afp,null=True,blank=True)
    sistema_salud = models.ForeignKey(SistemaSalud,null=True,default=1)
    estado_civil = models.ForeignKey(EstadoCivil,null=True,default=1)
    estado_vacaciones = models.NullBooleanField()

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

    def __unicode__(self):
        return self.nombre + ' ' + self.apellido

    class Meta:
        verbose_name_plural = "trabajadores"


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

    def __unicode__(self):
        return unicode(str(self.monto_descuento))


class Cliente(models.Model):
    giro = models.CharField(max_length=140)
    direccion = models.TextField()
    telefono = models.CharField(max_length=140)
    rut = models.CharField(max_length=140)
    situacion_comercial = models.ForeignKey(DescuentoCliente)
    credito = models.IntegerField(null=True)

    def __unicode__(self):
        return self.nombre + " " + self.telefono


class EstadoTerminal(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class Terminal(models.Model):
    codigo = models.CharField(max_length=140)
    vehiculo = models.ForeignKey(Vehiculo)
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
    vehiculo = models.ForeignKey(Vehiculo)
    fecha = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return self.terminal.codigo + "(" + self.vehiculo.p + ") " + self.fecha


#crear tabla procedencia

class Venta(models.Model):
    numero_serie = models.IntegerField(null=True)
    trabajador = models.ForeignKey(Trabajador)
    cliente = models.ForeignKey(Cliente)
    monto = models.IntegerField()
    fecha = models.DateTimeField()
    tipo_pago = models.ForeignKey(TipoPago)
    descuento = models.IntegerField()
    cupon_asociado = models.NullBooleanField()
    descripcion_descuento = models.CharField(max_length=140,null=True)
    #averiguar procedencia

    def __unicode__(self):
        return self.monto


class Cupon(models.Model):
    numero_cupon = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)
    descuento = models.IntegerField()
    venta = models.ForeignKey(Venta)

    def __unicode__(self):
        return self.numero_cupon


class Voucher(models.Model):
    tipo_tarjeta = models.ForeignKey(TipoTarjeta, null=True)
    tipo_cuotas = models.CharField(max_length=140,null=True)
    terminal = models.ForeignKey(Terminal)
    numero_tarjeta = models.IntegerField(null=True)
    numero_operacion = models.IntegerField()
    codigo_autorizacion = models.IntegerField()
    numero_cuotas = models.IntegerField(default=1)
    venta = models.ForeignKey(Venta)

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
