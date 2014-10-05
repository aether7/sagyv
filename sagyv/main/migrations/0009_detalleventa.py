# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_remove_venta_cupon_asociado'),
    ]

    operations = [
        migrations.CreateModel(
            name='DetalleVenta',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cantidad', models.IntegerField()),
                ('producto', models.ForeignKey(to='main.Producto')),
                ('venta', models.ForeignKey(to='main.Venta')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
