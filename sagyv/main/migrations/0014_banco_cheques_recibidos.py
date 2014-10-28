# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_auto_20141022_1853'),
    ]

    operations = [
        migrations.AddField(
            model_name='banco',
            name='cheques_recibidos',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
