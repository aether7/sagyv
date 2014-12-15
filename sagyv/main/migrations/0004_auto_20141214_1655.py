# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20141211_1651'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='terminal',
            name='vehiculo',
        ),
        migrations.AddField(
            model_name='terminal',
            name='trabajador',
            field=models.ForeignKey(to='main.Trabajador', null=True),
            preserve_default=True,
        ),
    ]
