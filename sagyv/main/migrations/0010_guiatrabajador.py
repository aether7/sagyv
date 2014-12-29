# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20141222_1009'),
    ]

    operations = [
        migrations.CreateModel(
            name='GuiaTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('guia_inicial', models.IntegerField(default=1)),
                ('guia_final', models.IntegerField(default=2)),
                ('actual', models.IntegerField(default=1)),
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
