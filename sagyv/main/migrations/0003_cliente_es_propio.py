# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20140904_1803'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='es_propio',
            field=models.NullBooleanField(),
            preserve_default=True,
        ),
    ]
