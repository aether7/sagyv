# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_guiatrabajador'),
    ]

    operations = [
        migrations.AddField(
            model_name='guiaventa',
            name='numero',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
    ]
