# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidacion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LipigasVoucher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero_cierre', models.IntegerField()),
                ('monto', models.IntegerField()),
                ('numero_cuotas', models.IntegerField(null=True)),
                ('numero_tarjeta', models.IntegerField(null=True)),
                ('numero_operacion', models.IntegerField(null=True)),
                ('codigo_autorizacion', models.IntegerField(null=True)),
                ('liquidacion', models.ForeignKey(to='liquidacion.Liquidacion')),
                ('terminal', models.ForeignKey(to='liquidacion.Terminal')),
                ('tipo_tarjeta', models.ForeignKey(to='liquidacion.TipoTarjeta')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TransbankVoucher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('numero_cuotas', models.IntegerField(null=True)),
                ('numero_tarjeta', models.IntegerField(null=True)),
                ('numero_operacion', models.IntegerField(null=True)),
                ('codigo_autorizacion', models.IntegerField(null=True)),
                ('liquidacion', models.ForeignKey(to='liquidacion.Liquidacion')),
                ('terminal', models.ForeignKey(to='liquidacion.Terminal')),
                ('tipo_tarjeta', models.ForeignKey(to='liquidacion.TipoTarjeta')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='voucher',
            name='liquidacion',
        ),
        migrations.RemoveField(
            model_name='voucher',
            name='terminal',
        ),
        migrations.RemoveField(
            model_name='voucher',
            name='tipo_tarjeta',
        ),
        migrations.RemoveField(
            model_name='cuotavoucher',
            name='voucher',
        ),
        migrations.DeleteModel(
            name='Voucher',
        ),
        migrations.AddField(
            model_name='cuotavoucher',
            name='lipigas',
            field=models.ForeignKey(to='liquidacion.LipigasVoucher', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuotavoucher',
            name='transbank',
            field=models.ForeignKey(to='liquidacion.TransbankVoucher', null=True),
            preserve_default=True,
        ),
    ]
