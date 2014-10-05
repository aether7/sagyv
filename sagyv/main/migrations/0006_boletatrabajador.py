# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20140904_2053'),
    ]

    operations = [
        migrations.CreateModel(
            name='BoletaTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('boleta_inicial', models.IntegerField()),
                ('boleta_final', models.IntegerField()),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_modificacion', models.DateTimeField(auto_now=True)),
                ('activo', models.NullBooleanField()),
                ('trabajador', models.ForeignKey(to='main.Trabajador')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
