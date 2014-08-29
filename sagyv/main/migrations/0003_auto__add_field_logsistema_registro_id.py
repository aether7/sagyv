# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'LogSistema.registro_id'
        db.add_column(u'main_logsistema', 'registro_id',
                      self.gf('django.db.models.fields.IntegerField')(default=0),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'LogSistema.registro_id'
        db.delete_column(u'main_logsistema', 'registro_id')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
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
        u'main.logsistema': {
            'Meta': {'object_name': 'LogSistema'},
            'descripcion': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'fecha': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'registro_id': ('django.db.models.fields.IntegerField', [], {}),
            'tabla': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'tipo_accion': ('django.db.models.fields.IntegerField', [], {}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
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