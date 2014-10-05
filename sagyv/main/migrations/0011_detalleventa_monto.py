# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_banco'),
    ]

    operations = [
        migrations.AddField(
            model_name='detalleventa',
            name='monto',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
