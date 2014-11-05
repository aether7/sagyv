# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_auto_20141105_1643'),
    ]

    operations = [
        migrations.AddField(
            model_name='historialcambiovehiculo',
            name='estado',
            field=models.NullBooleanField(),
            preserve_default=True,
        ),
    ]
