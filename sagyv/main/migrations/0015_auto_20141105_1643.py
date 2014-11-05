# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_banco_cheques_recibidos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='terminal',
            name='vehiculo',
            field=models.ForeignKey(to='main.Vehiculo', null=True),
        ),
    ]
