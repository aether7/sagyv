# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bodega', '0001_initial'),
    ]

    operations = [
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
            name='DescuentoCliente',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto_descuento', models.IntegerField()),
                ('producto', models.ForeignKey(to='bodega.Producto', null=True)),
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
            name='TipoDescuento',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tipo', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='descuentocliente',
            name='tipo_descuento',
            field=models.ForeignKey(to='clientes.TipoDescuento'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='comuna',
            name='region',
            field=models.ForeignKey(to='clientes.Region'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cliente',
            name='situacion_comercial',
            field=models.ForeignKey(to='clientes.DescuentoCliente'),
            preserve_default=True,
        ),
    ]
