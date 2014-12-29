# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bodega', '0001_initial'),
        ('liquidacion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistorialCambioVehiculo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('estado', models.NullBooleanField()),
                ('movil', models.ForeignKey(to='bodega.Movil', null=True)),
                ('terminal', models.ForeignKey(to='liquidacion.Terminal')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
