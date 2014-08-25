# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Region'
        db.create_table(u'main_region', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('orden', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['Region'])

        # Adding model 'Comuna'
        db.create_table(u'main_comuna', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('region', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Region'])),
        ))
        db.send_create_signal(u'main', ['Comuna'])

        # Adding model 'Herramienta'
        db.create_table(u'main_herramienta', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('stock', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['Herramienta'])

        # Adding model 'Filtro'
        db.create_table(u'main_filtro', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('km_cambio', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['Filtro'])

        # Adding model 'Vehiculo'
        db.create_table(u'main_vehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('numero', self.gf('django.db.models.fields.IntegerField')()),
            ('patente', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('fecha_revision_tecnica', self.gf('django.db.models.fields.DateField')()),
            ('km', self.gf('django.db.models.fields.IntegerField')()),
            ('estado_sec', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('estado_pago', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['Vehiculo'])

        # Adding model 'PagoVehiculo'
        db.create_table(u'main_pagovehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('cantidad_cuotas', self.gf('django.db.models.fields.IntegerField')()),
            ('valor_cuota', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['PagoVehiculo'])

        # Adding model 'PagoCuotaVehiculo'
        db.create_table(u'main_pagocuotavehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('pagoVehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.PagoVehiculo'])),
            ('numero_cuota', self.gf('django.db.models.fields.IntegerField')()),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['PagoCuotaVehiculo'])

        # Adding model 'Mantencion'
        db.create_table(u'main_mantencion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('km', self.gf('django.db.models.fields.IntegerField')()),
            ('descripcion', self.gf('django.db.models.fields.CharField')(max_length=500)),
        ))
        db.send_create_signal(u'main', ['Mantencion'])

        # Adding model 'CambioFiltro'
        db.create_table(u'main_cambiofiltro', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('mantencion', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Mantencion'])),
            ('filtro', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Filtro'])),
            ('km_cambio', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['CambioFiltro'])

        # Adding model 'CambioAceite'
        db.create_table(u'main_cambioaceite', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('mantencion', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Mantencion'])),
            ('km_cambio', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'main', ['CambioAceite'])

        # Adding model 'Afp'
        db.create_table(u'main_afp', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['Afp'])

        # Adding model 'SistemaSalud'
        db.create_table(u'main_sistemasalud', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['SistemaSalud'])

        # Adding model 'EstadoCivil'
        db.create_table(u'main_estadocivil', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['EstadoCivil'])

        # Adding model 'EstadoVacacion'
        db.create_table(u'main_estadovacacion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['EstadoVacacion'])

        # Adding model 'Trabajador'
        db.create_table(u'main_trabajador', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('apellido', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('rut', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('domicilio', self.gf('django.db.models.fields.CharField')(max_length=140, null=True, blank=True)),
            ('nacimiento', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('fecha_inicio_contrato', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('vigencia_licencia', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('afp', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Afp'], null=True, blank=True)),
            ('sistema_salud', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['main.SistemaSalud'], null=True)),
            ('estado_civil', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['main.EstadoCivil'], null=True)),
        ))
        db.send_create_signal(u'main', ['Trabajador'])

        # Adding model 'Vacacion'
        db.create_table(u'main_vacacion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('trabajador', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Trabajador'])),
            ('estado_vacacion', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.EstadoVacacion'])),
            ('fecha_inicio', self.gf('django.db.models.fields.DateField')(null=True)),
            ('dias_restantes', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('activo', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['Vacacion'])

        # Adding model 'CargaFamiliar'
        db.create_table(u'main_cargafamiliar', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140, null=True)),
            ('edad', self.gf('django.db.models.fields.IntegerField')()),
            ('trabajador', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Trabajador'])),
        ))
        db.send_create_signal(u'main', ['CargaFamiliar'])

        # Adding model 'HerramientaTrabajador'
        db.create_table(u'main_herramientatrabajador', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('trabajador', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Trabajador'])),
            ('herramienta', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Herramienta'])),
            ('fecha_entrega', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('fecha_retorno', self.gf('django.db.models.fields.DateField')(null=True)),
        ))
        db.send_create_signal(u'main', ['HerramientaTrabajador'])

        # Adding model 'TrabajadorVehiculo'
        db.create_table(u'main_trabajadorvehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('trabajador', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Trabajador'])),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('fecha', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('activo', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal(u'main', ['TrabajadorVehiculo'])

        # Adding model 'TipoProducto'
        db.create_table(u'main_tipoproducto', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['TipoProducto'])

        # Adding model 'Producto'
        db.create_table(u'main_producto', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('codigo', self.gf('django.db.models.fields.IntegerField')()),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('peso', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('tipo_producto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.TipoProducto'])),
            ('stock', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('nivel_critico', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('orden', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'main', ['Producto'])

        # Adding model 'TipoCambioStock'
        db.create_table(u'main_tipocambiostock', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['TipoCambioStock'])

        # Adding model 'GuiaDespacho'
        db.create_table(u'main_guiadespacho', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('numero', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'], null=True)),
            ('factura', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('fecha', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('tipo_guia', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['GuiaDespacho'])

        # Adding model 'HistorialStock'
        db.create_table(u'main_historialstock', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('producto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Producto'])),
            ('cantidad', self.gf('django.db.models.fields.IntegerField')()),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('tipo_operacion', self.gf('django.db.models.fields.BooleanField')()),
            ('guia_despacho', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.GuiaDespacho'])),
            ('es_recarga', self.gf('django.db.models.fields.BooleanField')()),
        ))
        db.send_create_signal(u'main', ['HistorialStock'])

        # Adding model 'TipoTarjeta'
        db.create_table(u'main_tipotarjeta', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['TipoTarjeta'])

        # Adding model 'TarjetaCredito'
        db.create_table(u'main_tarjetacredito', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('codigo', self.gf('django.db.models.fields.CharField')(max_length=140, null=True)),
            ('tipo_tarjeta', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.TipoTarjeta'])),
        ))
        db.send_create_signal(u'main', ['TarjetaCredito'])

        # Adding model 'TipoPago'
        db.create_table(u'main_tipopago', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['TipoPago'])

        # Adding model 'TipoDescuento'
        db.create_table(u'main_tipodescuento', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('tipo', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['TipoDescuento'])

        # Adding model 'DescuentoCliente'
        db.create_table(u'main_descuentocliente', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('monto_descuento', self.gf('django.db.models.fields.IntegerField')()),
            ('tipo_descuento', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.TipoDescuento'])),
            ('producto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Producto'], null=True)),
        ))
        db.send_create_signal(u'main', ['DescuentoCliente'])

        # Adding model 'Cliente'
        db.create_table(u'main_cliente', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('giro', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('direccion', self.gf('django.db.models.fields.TextField')()),
            ('telefono', self.gf('django.db.models.fields.CharField')(max_length=140, null=True)),
            ('rut', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('situacion_comercial', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.DescuentoCliente'])),
            ('credito', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('dispensador', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('es_lipigas', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('observacion', self.gf('django.db.models.fields.CharField')(max_length=500, null=True)),
        ))
        db.send_create_signal(u'main', ['Cliente'])

        # Adding model 'EstadoTerminal'
        db.create_table(u'main_estadoterminal', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(max_length=140)),
        ))
        db.send_create_signal(u'main', ['EstadoTerminal'])

        # Adding model 'Terminal'
        db.create_table(u'main_terminal', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('codigo', self.gf('django.db.models.fields.CharField')(max_length=140)),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('estado', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.EstadoTerminal'])),
        ))
        db.send_create_signal(u'main', ['Terminal'])

        # Adding model 'HistorialEstadoTerminal'
        db.create_table(u'main_historialestadoterminal', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('terminal', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Terminal'])),
            ('estado', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.EstadoTerminal'])),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['HistorialEstadoTerminal'])

        # Adding model 'HistorialCambioVehiculo'
        db.create_table(u'main_historialcambiovehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('terminal', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Terminal'])),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['HistorialCambioVehiculo'])

        # Adding model 'Venta'
        db.create_table(u'main_venta', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('numero_serie', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('trabajador', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Trabajador'])),
            ('cliente', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Cliente'])),
            ('monto', self.gf('django.db.models.fields.IntegerField')()),
            ('fecha', self.gf('django.db.models.fields.DateTimeField')()),
            ('tipo_pago', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.TipoPago'])),
            ('descuento', self.gf('django.db.models.fields.IntegerField')()),
            ('cupon_asociado', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('descripcion_descuento', self.gf('django.db.models.fields.CharField')(max_length=140, null=True)),
        ))
        db.send_create_signal(u'main', ['Venta'])

        # Adding model 'Cupon'
        db.create_table(u'main_cupon', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('numero_cupon', self.gf('django.db.models.fields.IntegerField')()),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('descuento', self.gf('django.db.models.fields.IntegerField')()),
            ('venta', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Venta'])),
        ))
        db.send_create_signal(u'main', ['Cupon'])

        # Adding model 'Voucher'
        db.create_table(u'main_voucher', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('tipo_tarjeta', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.TipoTarjeta'], null=True)),
            ('tipo_cuotas', self.gf('django.db.models.fields.CharField')(max_length=140, null=True)),
            ('terminal', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Terminal'])),
            ('numero_tarjeta', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('numero_operacion', self.gf('django.db.models.fields.IntegerField')()),
            ('codigo_autorizacion', self.gf('django.db.models.fields.IntegerField')()),
            ('numero_cuotas', self.gf('django.db.models.fields.IntegerField')(default=1)),
            ('venta', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Venta'])),
        ))
        db.send_create_signal(u'main', ['Voucher'])

        # Adding model 'CuotaVoucher'
        db.create_table(u'main_cuotavoucher', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('voucher', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Voucher'])),
            ('monto', self.gf('django.db.models.fields.IntegerField')()),
            ('pagado', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['CuotaVoucher'])

        # Adding model 'Cierre'
        db.create_table(u'main_cierre', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('correlativo_cierre', self.gf('django.db.models.fields.IntegerField')()),
            ('numero_cierre', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('terminal', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Terminal'])),
        ))
        db.send_create_signal(u'main', ['Cierre'])

        # Adding model 'DetalleCierre'
        db.create_table(u'main_detallecierre', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cantidad_ventas', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('cantidad_anuladas', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('valor_venta', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('valor_anuladas', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('cierre', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Cierre'])),
        ))
        db.send_create_signal(u'main', ['DetalleCierre'])

        # Adding model 'PrecioProducto'
        db.create_table(u'main_precioproducto', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('producto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Producto'])),
            ('precio', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('fecha', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'main', ['PrecioProducto'])

        # Adding model 'StockVehiculo'
        db.create_table(u'main_stockvehiculo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('vehiculo', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Vehiculo'])),
            ('producto', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Producto'])),
            ('cantidad', self.gf('django.db.models.fields.IntegerField')(null=True)),
        ))
        db.send_create_signal(u'main', ['StockVehiculo'])


    def backwards(self, orm):
        # Deleting model 'Region'
        db.delete_table(u'main_region')

        # Deleting model 'Comuna'
        db.delete_table(u'main_comuna')

        # Deleting model 'Herramienta'
        db.delete_table(u'main_herramienta')

        # Deleting model 'Filtro'
        db.delete_table(u'main_filtro')

        # Deleting model 'Vehiculo'
        db.delete_table(u'main_vehiculo')

        # Deleting model 'PagoVehiculo'
        db.delete_table(u'main_pagovehiculo')

        # Deleting model 'PagoCuotaVehiculo'
        db.delete_table(u'main_pagocuotavehiculo')

        # Deleting model 'Mantencion'
        db.delete_table(u'main_mantencion')

        # Deleting model 'CambioFiltro'
        db.delete_table(u'main_cambiofiltro')

        # Deleting model 'CambioAceite'
        db.delete_table(u'main_cambioaceite')

        # Deleting model 'Afp'
        db.delete_table(u'main_afp')

        # Deleting model 'SistemaSalud'
        db.delete_table(u'main_sistemasalud')

        # Deleting model 'EstadoCivil'
        db.delete_table(u'main_estadocivil')

        # Deleting model 'EstadoVacacion'
        db.delete_table(u'main_estadovacacion')

        # Deleting model 'Trabajador'
        db.delete_table(u'main_trabajador')

        # Deleting model 'Vacacion'
        db.delete_table(u'main_vacacion')

        # Deleting model 'CargaFamiliar'
        db.delete_table(u'main_cargafamiliar')

        # Deleting model 'HerramientaTrabajador'
        db.delete_table(u'main_herramientatrabajador')

        # Deleting model 'TrabajadorVehiculo'
        db.delete_table(u'main_trabajadorvehiculo')

        # Deleting model 'TipoProducto'
        db.delete_table(u'main_tipoproducto')

        # Deleting model 'Producto'
        db.delete_table(u'main_producto')

        # Deleting model 'TipoCambioStock'
        db.delete_table(u'main_tipocambiostock')

        # Deleting model 'GuiaDespacho'
        db.delete_table(u'main_guiadespacho')

        # Deleting model 'HistorialStock'
        db.delete_table(u'main_historialstock')

        # Deleting model 'TipoTarjeta'
        db.delete_table(u'main_tipotarjeta')

        # Deleting model 'TarjetaCredito'
        db.delete_table(u'main_tarjetacredito')

        # Deleting model 'TipoPago'
        db.delete_table(u'main_tipopago')

        # Deleting model 'TipoDescuento'
        db.delete_table(u'main_tipodescuento')

        # Deleting model 'DescuentoCliente'
        db.delete_table(u'main_descuentocliente')

        # Deleting model 'Cliente'
        db.delete_table(u'main_cliente')

        # Deleting model 'EstadoTerminal'
        db.delete_table(u'main_estadoterminal')

        # Deleting model 'Terminal'
        db.delete_table(u'main_terminal')

        # Deleting model 'HistorialEstadoTerminal'
        db.delete_table(u'main_historialestadoterminal')

        # Deleting model 'HistorialCambioVehiculo'
        db.delete_table(u'main_historialcambiovehiculo')

        # Deleting model 'Venta'
        db.delete_table(u'main_venta')

        # Deleting model 'Cupon'
        db.delete_table(u'main_cupon')

        # Deleting model 'Voucher'
        db.delete_table(u'main_voucher')

        # Deleting model 'CuotaVoucher'
        db.delete_table(u'main_cuotavoucher')

        # Deleting model 'Cierre'
        db.delete_table(u'main_cierre')

        # Deleting model 'DetalleCierre'
        db.delete_table(u'main_detallecierre')

        # Deleting model 'PrecioProducto'
        db.delete_table(u'main_precioproducto')

        # Deleting model 'StockVehiculo'
        db.delete_table(u'main_stockvehiculo')


    models = {
        u'main.afp': {
            'Meta': {'object_name': 'Afp'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.cambioaceite': {
            'Meta': {'object_name': 'CambioAceite'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'km_cambio': ('django.db.models.fields.IntegerField', [], {}),
            'mantencion': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Mantencion']"})
        },
        u'main.cambiofiltro': {
            'Meta': {'object_name': 'CambioFiltro'},
            'filtro': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Filtro']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'km_cambio': ('django.db.models.fields.IntegerField', [], {}),
            'mantencion': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Mantencion']"})
        },
        u'main.cargafamiliar': {
            'Meta': {'object_name': 'CargaFamiliar'},
            'edad': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True'}),
            'trabajador': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Trabajador']"})
        },
        u'main.cierre': {
            'Meta': {'object_name': 'Cierre'},
            'correlativo_cierre': ('django.db.models.fields.IntegerField', [], {}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'numero_cierre': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'terminal': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Terminal']"})
        },
        u'main.cliente': {
            'Meta': {'object_name': 'Cliente'},
            'credito': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'direccion': ('django.db.models.fields.TextField', [], {}),
            'dispensador': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'es_lipigas': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'giro': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'observacion': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'}),
            'rut': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'situacion_comercial': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.DescuentoCliente']"}),
            'telefono': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True'})
        },
        u'main.comuna': {
            'Meta': {'object_name': 'Comuna'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Region']"})
        },
        u'main.cuotavoucher': {
            'Meta': {'object_name': 'CuotaVoucher'},
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'monto': ('django.db.models.fields.IntegerField', [], {}),
            'pagado': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'voucher': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Voucher']"})
        },
        u'main.cupon': {
            'Meta': {'object_name': 'Cupon'},
            'descuento': ('django.db.models.fields.IntegerField', [], {}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'numero_cupon': ('django.db.models.fields.IntegerField', [], {}),
            'venta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Venta']"})
        },
        u'main.descuentocliente': {
            'Meta': {'object_name': 'DescuentoCliente'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'monto_descuento': ('django.db.models.fields.IntegerField', [], {}),
            'producto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Producto']", 'null': 'True'}),
            'tipo_descuento': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.TipoDescuento']"})
        },
        u'main.detallecierre': {
            'Meta': {'object_name': 'DetalleCierre'},
            'cantidad_anuladas': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'cantidad_ventas': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'cierre': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Cierre']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'valor_anuladas': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'valor_venta': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'main.estadocivil': {
            'Meta': {'object_name': 'EstadoCivil'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.estadoterminal': {
            'Meta': {'object_name': 'EstadoTerminal'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.estadovacacion': {
            'Meta': {'object_name': 'EstadoVacacion'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.filtro': {
            'Meta': {'object_name': 'Filtro'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'km_cambio': ('django.db.models.fields.IntegerField', [], {}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.guiadespacho': {
            'Meta': {'object_name': 'GuiaDespacho'},
            'factura': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'fecha': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'numero': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'tipo_guia': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']", 'null': 'True'})
        },
        u'main.herramienta': {
            'Meta': {'object_name': 'Herramienta'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'stock': ('django.db.models.fields.IntegerField', [], {})
        },
        u'main.herramientatrabajador': {
            'Meta': {'object_name': 'HerramientaTrabajador'},
            'fecha_entrega': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'fecha_retorno': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'herramienta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Herramienta']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'trabajador': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Trabajador']"})
        },
        u'main.historialcambiovehiculo': {
            'Meta': {'object_name': 'HistorialCambioVehiculo'},
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'terminal': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Terminal']"}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.historialestadoterminal': {
            'Meta': {'object_name': 'HistorialEstadoTerminal'},
            'estado': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.EstadoTerminal']"}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'terminal': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Terminal']"})
        },
        u'main.historialstock': {
            'Meta': {'object_name': 'HistorialStock'},
            'cantidad': ('django.db.models.fields.IntegerField', [], {}),
            'es_recarga': ('django.db.models.fields.BooleanField', [], {}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'guia_despacho': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.GuiaDespacho']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'producto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Producto']"}),
            'tipo_operacion': ('django.db.models.fields.BooleanField', [], {})
        },
        u'main.mantencion': {
            'Meta': {'object_name': 'Mantencion'},
            'descripcion': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'km': ('django.db.models.fields.IntegerField', [], {}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.pagocuotavehiculo': {
            'Meta': {'object_name': 'PagoCuotaVehiculo'},
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'numero_cuota': ('django.db.models.fields.IntegerField', [], {}),
            'pagoVehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.PagoVehiculo']"})
        },
        u'main.pagovehiculo': {
            'Meta': {'object_name': 'PagoVehiculo'},
            'cantidad_cuotas': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'valor_cuota': ('django.db.models.fields.IntegerField', [], {}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.precioproducto': {
            'Meta': {'object_name': 'PrecioProducto'},
            'fecha': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'precio': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'producto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Producto']"})
        },
        u'main.producto': {
            'Meta': {'object_name': 'Producto'},
            'codigo': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nivel_critico': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'orden': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'peso': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'stock': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'tipo_producto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.TipoProducto']"})
        },
        u'main.region': {
            'Meta': {'object_name': 'Region'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'orden': ('django.db.models.fields.IntegerField', [], {})
        },
        u'main.sistemasalud': {
            'Meta': {'object_name': 'SistemaSalud'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.stockvehiculo': {
            'Meta': {'object_name': 'StockVehiculo'},
            'cantidad': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'producto': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Producto']"}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.tarjetacredito': {
            'Meta': {'object_name': 'TarjetaCredito'},
            'codigo': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'tipo_tarjeta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.TipoTarjeta']"})
        },
        u'main.terminal': {
            'Meta': {'object_name': 'Terminal'},
            'codigo': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'estado': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.EstadoTerminal']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.tipocambiostock': {
            'Meta': {'object_name': 'TipoCambioStock'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.tipodescuento': {
            'Meta': {'object_name': 'TipoDescuento'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'tipo': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.tipopago': {
            'Meta': {'object_name': 'TipoPago'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.tipoproducto': {
            'Meta': {'object_name': 'TipoProducto'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.tipotarjeta': {
            'Meta': {'object_name': 'TipoTarjeta'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.trabajador': {
            'Meta': {'object_name': 'Trabajador'},
            'afp': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Afp']", 'null': 'True', 'blank': 'True'}),
            'apellido': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'domicilio': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True', 'blank': 'True'}),
            'estado_civil': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': u"orm['main.EstadoCivil']", 'null': 'True'}),
            'fecha_inicio_contrato': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nacimiento': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'rut': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'sistema_salud': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': u"orm['main.SistemaSalud']", 'null': 'True'}),
            'vigencia_licencia': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'})
        },
        u'main.trabajadorvehiculo': {
            'Meta': {'object_name': 'TrabajadorVehiculo'},
            'activo': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'fecha': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'trabajador': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Trabajador']"}),
            'vehiculo': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Vehiculo']"})
        },
        u'main.vacacion': {
            'Meta': {'object_name': 'Vacacion'},
            'activo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'dias_restantes': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'estado_vacacion': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.EstadoVacacion']"}),
            'fecha_inicio': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'trabajador': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Trabajador']"})
        },
        u'main.vehiculo': {
            'Meta': {'object_name': 'Vehiculo'},
            'estado_pago': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'estado_sec': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'fecha_revision_tecnica': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'km': ('django.db.models.fields.IntegerField', [], {}),
            'numero': ('django.db.models.fields.IntegerField', [], {}),
            'patente': ('django.db.models.fields.CharField', [], {'max_length': '140'})
        },
        u'main.venta': {
            'Meta': {'object_name': 'Venta'},
            'cliente': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Cliente']"}),
            'cupon_asociado': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'descripcion_descuento': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True'}),
            'descuento': ('django.db.models.fields.IntegerField', [], {}),
            'fecha': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'monto': ('django.db.models.fields.IntegerField', [], {}),
            'numero_serie': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'tipo_pago': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.TipoPago']"}),
            'trabajador': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Trabajador']"})
        },
        u'main.voucher': {
            'Meta': {'object_name': 'Voucher'},
            'codigo_autorizacion': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'numero_cuotas': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'numero_operacion': ('django.db.models.fields.IntegerField', [], {}),
            'numero_tarjeta': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'terminal': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Terminal']"}),
            'tipo_cuotas': ('django.db.models.fields.CharField', [], {'max_length': '140', 'null': 'True'}),
            'tipo_tarjeta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.TipoTarjeta']", 'null': 'True'}),
            'venta': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Venta']"})
        }
    }

    complete_apps = ['main']