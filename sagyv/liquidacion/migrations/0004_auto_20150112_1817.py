# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidacion', '0003_auto_20150112_1808'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lipigasvoucher',
            name='tipo_tarjeta',
            field=models.ForeignKey(to='liquidacion.TarjetaCredito'),
        ),
        migrations.AlterField(
            model_name='transbankvoucher',
            name='tipo_tarjeta',
            field=models.ForeignKey(to='liquidacion.TarjetaCredito'),
        ),
    ]
