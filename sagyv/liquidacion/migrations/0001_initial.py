# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0001_initial'),
        ('main', '0001_initial'),
        ('bodega', '0001_initial'),
    ]

    operations = [
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
            name='Cheque',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField()),
                ('numero', models.IntegerField()),
                ('cobrado', models.BooleanField(default=False)),
                ('banco', models.ForeignKey(to='liquidacion.Banco')),
                ('emisor', models.ForeignKey(to='clientes.Cliente', null=True)),
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
                ('cliente', models.ForeignKey(to='clientes.Cliente')),
                ('formato', models.ForeignKey(to='bodega.Producto')),
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
                ('cierre', models.ForeignKey(to='liquidacion.Cierre')),
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
            name='GuiaVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero', models.IntegerField(null=True)),
                ('propia', models.NullBooleanField()),
                ('cliente', models.ForeignKey(to='clientes.Cliente')),
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
                ('estado', models.ForeignKey(to='liquidacion.EstadoTerminal')),
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
                ('guia_despacho', models.ForeignKey(to='bodega.GuiaDespacho')),
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
                ('liquidacion', models.ForeignKey(to='liquidacion.Liquidacion')),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
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
                ('estado', models.ForeignKey(to='liquidacion.EstadoTerminal')),
                ('movil', models.ForeignKey(to='bodega.Movil', null=True)),
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
            name='Voucher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tipo_cuotas', models.CharField(max_length=140, null=True)),
                ('numero_tarjeta', models.IntegerField(null=True)),
                ('numero_operacion', models.IntegerField(null=True)),
                ('codigo_autorizacion', models.IntegerField(null=True)),
                ('numero_cuotas', models.IntegerField(default=1)),
                ('liquidacion', models.ForeignKey(to='liquidacion.Liquidacion')),
                ('terminal', models.ForeignKey(to='liquidacion.Terminal')),
                ('tipo_tarjeta', models.ForeignKey(to='liquidacion.TipoTarjeta', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='tarjetacredito',
            name='tipo_tarjeta',
            field=models.ForeignKey(to='liquidacion.TipoTarjeta'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialestadoterminal',
            name='terminal',
            field=models.ForeignKey(to='liquidacion.Terminal'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guiaventa',
            name='liquidacion',
            field=models.ForeignKey(to='liquidacion.Liquidacion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='detalleguiaventa',
            name='guia_venta',
            field=models.ForeignKey(to='liquidacion.GuiaVenta'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='detalleguiaventa',
            name='producto',
            field=models.ForeignKey(to='bodega.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuponprepago',
            name='liquidacion',
            field=models.ForeignKey(to='liquidacion.Liquidacion'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuotavoucher',
            name='voucher',
            field=models.ForeignKey(to='liquidacion.Voucher'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cierre',
            name='terminal',
            field=models.ForeignKey(to='liquidacion.Terminal'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cheque',
            name='liquidacion',
            field=models.ForeignKey(to='liquidacion.Liquidacion'),
            preserve_default=True,
        ),
    ]
