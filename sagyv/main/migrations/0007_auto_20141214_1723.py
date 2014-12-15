# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20141214_1713'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historialcambiovehiculo',
            name='vehiculo',
        ),
        migrations.RemoveField(
            model_name='terminal',
            name='trabajador',
        ),
        migrations.AddField(
            model_name='historialcambiovehiculo',
            name='movil',
            field=models.ForeignKey(to='main.Movil', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='terminal',
            name='movil',
            field=models.ForeignKey(to='main.Movil', null=True),
            preserve_default=True,
        ),
    ]
