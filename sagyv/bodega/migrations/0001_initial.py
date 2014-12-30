# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trabajador', '0001_initial'),
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
            name='HistorialStock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
                ('es_recarga', models.NullBooleanField()),
                ('factura', models.ForeignKey(to='bodega.Factura', null=True)),
                ('guia_despacho', models.ForeignKey(to='bodega.GuiaDespacho', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Movil',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero', models.IntegerField(null=True)),
                ('fecha', models.DateTimeField(auto_now=True, auto_now_add=True)),
                ('trabajador', models.ForeignKey(to='trabajador.Trabajador', null=True)),
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
            name='StockVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField(null=True)),
                ('producto', models.ForeignKey(to='bodega.Producto')),
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
            name='TrabajadorVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('activo', models.BooleanField(default=True)),
                ('trabajador', models.ForeignKey(to='trabajador.Trabajador', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
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
        migrations.AddField(
            model_name='trabajadorvehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='bodega.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='stockvehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='bodega.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='producto',
            name='tipo_producto',
            field=models.ForeignKey(to='bodega.TipoProducto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='precioproducto',
            name='producto',
            field=models.ForeignKey(to='bodega.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pagovehiculo',
            name='vehiculo',
            field=models.ForeignKey(to='bodega.Vehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pagocuotavehiculo',
            name='pagoVehiculo',
            field=models.ForeignKey(to='bodega.PagoVehiculo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='movil',
            name='vehiculo',
            field=models.ForeignKey(to='bodega.Vehiculo', unique=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialstock',
            name='producto',
            field=models.ForeignKey(to='bodega.Producto'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guiadespacho',
            name='movil',
            field=models.ForeignKey(to='bodega.Movil'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='abonoguia',
            name='guia_despacho',
            field=models.ForeignKey(to='bodega.GuiaDespacho'),
            preserve_default=True,
        ),
    ]
