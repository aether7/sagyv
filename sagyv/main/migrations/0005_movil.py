# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20141214_1655'),
    ]

    operations = [
        migrations.CreateModel(
            name='Movil',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero', models.IntegerField(null=True)),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
                ('vehiculo', models.ForeignKey(to='main.Vehiculo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
