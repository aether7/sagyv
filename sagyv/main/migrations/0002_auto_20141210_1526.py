# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cuponprepago',
            name='cliente',
            field=models.ForeignKey(default=101220141526, to='main.Cliente'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cuponprepago',
            name='formato',
            field=models.ForeignKey(default=101220141526, to='main.Producto'),
            preserve_default=False,
        ),
    ]
