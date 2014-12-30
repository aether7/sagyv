# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Afp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BoletaTrabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('boleta_inicial', models.IntegerField(default=1)),
                ('boleta_final', models.IntegerField(default=2)),
                ('actual', models.IntegerField(default=1)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_modificacion', models.DateTimeField(auto_now=True)),
                ('activo', models.NullBooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CargaFamiliar',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140, null=True)),
                ('edad', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EstadoCivil',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EstadoVacacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
                'verbose_name_plural': 'estados de vacaciones',
            },
            bases=(models.Model,),
        ),
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
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SistemaSalud',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
            ],
            options={
                'verbose_name_plural': 'sistemas salud',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Trabajador',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nombre', models.CharField(max_length=140)),
                ('apellido', models.CharField(max_length=140)),
                ('rut', models.CharField(max_length=140)),
                ('domicilio', models.CharField(max_length=140, null=True, blank=True)),
                ('nacimiento', models.DateField(null=True, blank=True)),
                ('fecha_inicio_contrato', models.DateField(null=True, blank=True)),
                ('vigencia_licencia', models.DateField(null=True, blank=True)),
                ('afp', models.ForeignKey(blank=True, to='trabajador.Afp', null=True)),
                ('estado_civil', models.ForeignKey(default=1, to='trabajador.EstadoCivil', null=True)),
                ('sistema_salud', models.ForeignKey(default=1, to='trabajador.SistemaSalud', null=True)),
            ],
            options={
                'verbose_name_plural': 'trabajadores',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Vacacion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha_inicio', models.DateField(null=True)),
                ('dias_restantes', models.IntegerField(null=True)),
                ('activo', models.NullBooleanField()),
                ('estado_vacacion', models.ForeignKey(to='trabajador.EstadoVacacion')),
                ('trabajador', models.ForeignKey(to='trabajador.Trabajador')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='guiatrabajador',
            name='trabajador',
            field=models.ForeignKey(to='trabajador.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cargafamiliar',
            name='trabajador',
            field=models.ForeignKey(to='trabajador.Trabajador'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='boletatrabajador',
            name='trabajador',
            field=models.ForeignKey(to='trabajador.Trabajador'),
            preserve_default=True,
        ),
    ]
