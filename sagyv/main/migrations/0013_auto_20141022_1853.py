# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_auto_20141020_2210'),
    ]

    operations = [
        migrations.CreateModel(
            name='Otros',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('concepto', models.CharField(max_length=255)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField(auto_now=True)),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='voucher',
            name='numero_operacion',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='voucher',
            name='venta',
            field=models.ForeignKey(to='main.Venta', null=True),
        ),
    ]
