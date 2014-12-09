# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_historialcambiovehiculo_estado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cupon',
            name='venta',
            field=models.ForeignKey(to='main.Venta', null=True),
        ),
    ]
