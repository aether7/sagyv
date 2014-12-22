# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_remove_vehiculo_numero'),
    ]

    operations = [
        migrations.AddField(
            model_name='movil',
            name='fecha',
            field=models.DateTimeField(default=datetime.date(2014, 12, 22), auto_now=True, auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movil',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador', null=True),
        ),
        migrations.AlterField(
            model_name='trabajadorvehiculo',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador', null=True),
        ),
    ]
