# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidacion', '0002_auto_20150112_1710'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transbankvoucher',
            name='terminal',
            field=models.ForeignKey(to='liquidacion.Terminal', null=True),
        ),
    ]
