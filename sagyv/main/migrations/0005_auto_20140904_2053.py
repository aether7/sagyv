# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20140904_2048'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historialstock',
            name='es_recarga',
            field=models.NullBooleanField(),
        ),
    ]
