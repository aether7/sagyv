# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trabajador', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='trabajador',
            name='tipo_trabajador',
            field=models.ForeignKey(default=1, to='trabajador.TipoTrabajador'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='trabajador',
            name='estado_civil',
            field=models.ForeignKey(blank=True, to='trabajador.EstadoCivil', null=True),
        ),
        migrations.AlterField(
            model_name='trabajador',
            name='sistema_salud',
            field=models.ForeignKey(blank=True, to='trabajador.SistemaSalud', null=True),
        ),
    ]
