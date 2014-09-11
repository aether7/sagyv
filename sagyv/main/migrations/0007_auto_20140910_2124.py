# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_boletatrabajador'),
    ]

    operations = [
        migrations.AddField(
            model_name='boletatrabajador',
            name='actual',
            field=models.IntegerField(default=1),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='boletatrabajador',
            name='boleta_final',
            field=models.IntegerField(default=2),
        ),
        migrations.AlterField(
            model_name='boletatrabajador',
            name='boleta_inicial',
            field=models.IntegerField(default=1),
        ),
    ]
