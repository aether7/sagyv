# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_cliente_es_propio'),
    ]

    operations = [
        migrations.CreateModel(
            name='AbonoGuia',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('monto', models.IntegerField()),
                ('fecha', models.DateField(auto_now_add=True)),
                ('guia_despacho', models.ForeignKey(to='main.GuiaDespacho')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numero_factura', models.IntegerField()),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('precio', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='guiadespacho',
            name='factura',
        ),
        migrations.RemoveField(
            model_name='guiadespacho',
            name='tipo_guia',
        ),
        migrations.RemoveField(
            model_name='historialstock',
            name='tipo_operacion',
        ),
        migrations.AddField(
            model_name='guiadespacho',
            name='estado',
            field=models.NullBooleanField(),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='guiadespacho',
            name='valor_total',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='historialstock',
            name='factura',
            field=models.ForeignKey(to='main.Factura', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='historialstock',
            name='es_recarga',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='historialstock',
            name='guia_despacho',
            field=models.ForeignKey(to='main.GuiaDespacho', null=True),
        ),
    ]
