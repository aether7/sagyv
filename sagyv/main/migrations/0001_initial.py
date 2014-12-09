# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AbonoGuia',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Afp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Banco',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=255)),
                ('cheques_recibidos', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BoletaTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('boleta_inicial', models.IntegerField(default=1)),
                ('boleta_final', models.IntegerField(default=2)),
                ('actual', models.IntegerField(default=1)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_modificacion', models.DateTimeField(auto_now=True)),
                ('activo', models.NullBooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CambioAceite',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('km_cambio', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CambioFiltro',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('km_cambio', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CargaFamiliar',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140, null=True)),
                ('edad', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Cheque',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField()),
                ('numero', models.IntegerField()),
                ('cobrado', models.BooleanField(default=False)),
                ('banco', models.ForeignKey(to='main.Banco')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Cierre',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('correlativo_cierre', models.IntegerField()),
                ('numero_cierre', models.IntegerField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('giro', models.CharField(max_length=140)),
                ('direccion', models.TextField()),
                ('telefono', models.CharField(max_length=140, null=True)),
                ('rut', models.CharField(max_length=140)),
                ('credito', models.NullBooleanField()),
                ('dispensador', models.NullBooleanField()),
                ('es_lipigas', models.NullBooleanField()),
                ('es_propio', models.NullBooleanField()),
                ('observacion', models.CharField(max_length=500, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Comuna',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CuotaVoucher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('pagado', models.NullBooleanField()),
                ('fecha', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CuponPrepago',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero_cupon', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
                ('descuento', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DescuentoCliente',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto_descuento', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DetalleCierre',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad_ventas', models.IntegerField(default=0)),
                ('cantidad_anuladas', models.IntegerField(default=0)),
                ('valor_venta', models.IntegerField(default=0)),
                ('valor_anuladas', models.IntegerField(default=0)),
                ('cierre', models.ForeignKey(to='main.Cierre')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DetalleGuiaVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EstadoCivil',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EstadoTerminal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EstadoVacacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
                'verbose_name_plural': 'estados de vacaciones',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero_factura', models.IntegerField()),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('precio', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Filtro',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('km_cambio', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GuiaDespacho',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero', models.IntegerField(null=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('valor_total', models.IntegerField(default=0)),
                ('estado', models.NullBooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GuiaVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('propia', models.NullBooleanField()),
                ('cliente', models.ForeignKey(to='main.Cliente')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Herramienta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('stock', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HerramientaTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha_entrega', models.DateField(auto_now_add=True)),
                ('fecha_retorno', models.DateField(null=True)),
                ('herramienta', models.ForeignKey(to='main.Herramienta')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HistorialCambioVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('estado', models.NullBooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HistorialEstadoTerminal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('estado', models.ForeignKey(to='main.EstadoTerminal')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HistorialStock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
                ('es_recarga', models.NullBooleanField()),
                ('factura', models.ForeignKey(to='main.Factura', null=True)),
                ('guia_despacho', models.ForeignKey(to='main.GuiaDespacho', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Liquidacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('terminada', models.BooleanField(default=False)),
                ('guia_despacho', models.ForeignKey(to='main.GuiaDespacho')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LogSistema',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('descripcion', models.TextField(null=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('tipo_accion', models.IntegerField()),
                ('tabla', models.CharField(max_length=140)),
                ('registro_id', models.IntegerField()),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Mantencion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('km', models.IntegerField()),
                ('descripcion', models.CharField(max_length=500)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Otros',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('concepto', models.CharField(max_length=255)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField(auto_now=True)),
                ('liquidacion', models.ForeignKey(to='main.Liquidacion')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PagoCuotaVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero_cuota', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PagoVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad_cuotas', models.IntegerField()),
                ('valor_cuota', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PrecioProducto',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('precio', models.IntegerField(null=True)),
                ('fecha', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('codigo', models.IntegerField()),
                ('nombre', models.CharField(max_length=140)),
                ('peso', models.IntegerField(null=True)),
                ('stock', models.IntegerField(default=0)),
                ('nivel_critico', models.IntegerField(null=True)),
                ('orden', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('orden', models.IntegerField(null=True)),
            ],
            options={
                'verbose_name_plural': 'regiones',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SistemaSalud',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
                'verbose_name_plural': 'sistemas salud',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StockVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField(null=True)),
                ('producto', models.ForeignKey(to='main.Producto')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TarjetaCredito',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('codigo', models.CharField(max_length=140, null=True)),
            ],
            options={
                'verbose_name_plural': 'tarjetas credito',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Terminal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('codigo', models.CharField(max_length=140)),
                ('estado', models.ForeignKey(to='main.EstadoTerminal')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoCambioStock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoDescuento',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tipo', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoPago',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoProducto',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoTarjeta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Trabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('apellido', models.CharField(max_length=140)),
                ('rut', models.CharField(max_length=140)),
                ('domicilio', models.CharField(max_length=140, null=True, blank=True)),
                ('nacimiento', models.DateField(null=True, blank=True)),
                ('fecha_inicio_contrato', models.DateField(null=True, blank=True)),
                ('vigencia_licencia', models.DateField(null=True, blank=True)),
                ('afp', models.ForeignKey(blank=True, to='main.Afp', null=True)),
                ('estado_civil', models.ForeignKey(default=1, to='main.EstadoCivil', null=True)),
                ('sistema_salud', models.ForeignKey(default=1, to='main.SistemaSalud', null=True)),
            ],
            options={
                'verbose_name_plural': 'trabajadores',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TrabajadorVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('activo', models.BooleanField(default=True)),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vacacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha_inicio', models.DateField(null=True)),
                ('dias_restantes', models.IntegerField(null=True)),
                ('activo', models.NullBooleanField()),
                ('estado_vacacion', models.ForeignKey(to='main.EstadoVacacion')),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero', models.IntegerField()),
                ('patente', models.CharField(max_length=140)),
                ('fecha_revision_tecnica', models.DateField()),
                ('km', models.IntegerField()),
                ('estado_sec', models.NullBooleanField()),
                ('estado_pago', models.NullBooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Voucher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tipo_cuotas', models.CharField(max_length=140, null=True)),
                ('numero_tarjeta', models.IntegerField(null=True)),
                ('numero_operacion', models.IntegerField(null=True)),
                ('codigo_autorizacion', models.IntegerField()),
                ('numero_cuotas', models.IntegerField(default=1)),
                ('liquidacion', models.ForeignKey(to='main.Liquidacion')),
                ('terminal', models.ForeignKey(to='main.Terminal')),
                ('tipo_tarjeta', models.ForeignKey(to='main.TipoTarjeta', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='trabajadorvehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='terminal',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tarjetacredito',
            name='tipo_tarjeta',
            field=models.ForeignKey(to='main.TipoTarjeta'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='stockvehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='producto',
            name='tipo_producto',
            field=models.ForeignKey(to='main.TipoProducto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='precioproducto',
            name='producto',
            field=models.ForeignKey(to='main.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pagovehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pagocuotavehiculo',
            name='pagoVehiculo',
            field=models.ForeignKey(to='main.PagoVehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='otros',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='mantencion',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialstock',
            name='producto',
            field=models.ForeignKey(to='main.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialestadoterminal',
            name='terminal',
            field=models.ForeignKey(to='main.Terminal'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialcambiovehiculo',
            name='terminal',
            field=models.ForeignKey(to='main.Terminal'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialcambiovehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='herramientatrabajador',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guiaventa',
            name='liquidacion',
            field=models.ForeignKey(to='main.Liquidacion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guiadespacho',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='detalleguiaventa',
            name='guia_venta',
            field=models.ForeignKey(to='main.GuiaVenta'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='detalleguiaventa',
            name='producto',
            field=models.ForeignKey(to='main.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='descuentocliente',
            name='producto',
            field=models.ForeignKey(to='main.Producto', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='descuentocliente',
            name='tipo_descuento',
            field=models.ForeignKey(to='main.TipoDescuento'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuponprepago',
            name='liquidacion',
            field=models.ForeignKey(to='main.Liquidacion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuotavoucher',
            name='voucher',
            field=models.ForeignKey(to='main.Voucher'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='comuna',
            name='region',
            field=models.ForeignKey(to='main.Region'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cliente',
            name='situacion_comercial',
            field=models.ForeignKey(to='main.DescuentoCliente'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cierre',
            name='terminal',
            field=models.ForeignKey(to='main.Terminal'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cheque',
            name='emisor',
            field=models.ForeignKey(to='main.Cliente', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cheque',
            name='liquidacion',
            field=models.ForeignKey(to='main.Liquidacion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cargafamiliar',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cambiofiltro',
            name='filtro',
            field=models.ForeignKey(to='main.Filtro'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cambiofiltro',
            name='mantencion',
            field=models.ForeignKey(to='main.Mantencion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cambioaceite',
            name='mantencion',
            field=models.ForeignKey(to='main.Mantencion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='boletatrabajador',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='abonoguia',
            name='guia_despacho',
            field=models.ForeignKey(to='main.GuiaDespacho'),
            preserve_default=True,
        ),
    ]
