# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_detalleventa_monto'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cheque',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField()),
                ('numero', models.IntegerField()),
                ('cobrado', models.BooleanField(default=False)),
                ('banco', models.ForeignKey(to='main.Banco')),
                ('emisor', models.ForeignKey(to='main.Cliente', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='detalleventa',
            name='monto',
            field=models.IntegerField(),
        ),
    ]
