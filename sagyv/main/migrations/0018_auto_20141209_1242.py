# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_auto_20141209_1112'),
    ]

    operations = [
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
            name='GuiaVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(to='main.Cliente')),
                ('guia_despacho', models.ForeignKey(to='main.GuiaDespacho')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TipoGuiaVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='guiaventa',
            name='tipo',
            field=models.ForeignKey(to='main.TipoGuiaVenta'),
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
    ]
