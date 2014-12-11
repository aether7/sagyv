# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20141210_1526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voucher',
            name='codigo_autorizacion',
            field=models.IntegerField(null=True),
        ),
    ]
