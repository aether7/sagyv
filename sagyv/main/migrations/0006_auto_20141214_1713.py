# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_movil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movil',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador', unique=True),
        ),
        migrations.AlterField(
            model_name='movil',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo', unique=True),
        ),
    ]
