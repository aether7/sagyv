# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidacion', '0004_auto_20150112_1817'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lipigasvoucher',
            name='terminal',
            field=models.ForeignKey(to='liquidacion.Terminal', null=True),
        ),
    ]
