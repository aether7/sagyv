#-*- coding: utf-8 -*-
import json

from django.db import models
from django.contrib.auth.models import User

from trabajador.managers import BoletaTrabajadorManager

"""
Como nota adicional: Todos los ingresos que sean representados como booleanos
las columnas con valor 1 son entradas al sistema, mientras que los 0 seran representados
como salidas del sistema
"""

class Afp(models.Model):
    nombre = models.CharField(max_length = 140)

    def __unicode__(self):
        return self.nombre


class SistemaSalud(models.Model):
    nombre = models.CharField(max_length = 140)

    def __unicode__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "sistemas salud"


class EstadoCivil(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class TipoTrabajador(models.Model):
    CHOFER = 1
    FLETE = 2
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre


class EstadoVacacion(models.Model):
    nombre = models.CharField(max_length=140)

    def __unicode__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "estados de vacaciones"


class Trabajador(models.Model):
    nombre = models.CharField(max_length = 140)
    apellido = models.CharField(max_length = 140)
    rut = models.CharField(max_length = 140)
    domicilio = models.CharField(max_length = 140, null = True, blank = True)
    nacimiento = models.DateField(null = True, blank = True)
    fecha_inicio_contrato = models.DateField(null = True, blank = True)
    vigencia_licencia = models.DateField(null = True, blank = True)

    tipo_trabajador = models.ForeignKey(TipoTrabajador)
    afp = models.ForeignKey(Afp, null = True,blank = True)
    sistema_salud = models.ForeignKey(SistemaSalud, null = True, blank = True)
    estado_civil = models.ForeignKey(EstadoCivil, null = True, blank = True)

    def get_nombre_completo(self):
        return self.nombre + " " + self.apellido

    def get_json(self):
        data = {
            "id" : self.id,
            "nombre" : self.nombre,
            "apellido" : self.apellido,
            "rut" : self.rut,
            "dv" : self.dv
        }

        return json.dumps(data)

    def get_vacacion(self):
        ultima_vacacion = self.vacacion_set.order_by("-id")[0]

        return ultima_vacacion.__unicode__()

    def get_id_vacacion(self):
        ultima_vacacion = self.vacacion_set.order_by("-id")[0]

        return ultima_vacacion.estado_vacacion.id

    def __unicode__(self):
        return self.nombre + ' ' + self.apellido

    class Meta:
        verbose_name_plural = "trabajadores"


class Vacacion(models.Model):
    trabajador = models.ForeignKey(Trabajador)
    estado_vacacion = models.ForeignKey(EstadoVacacion)
    fecha_inicio = models.DateField(null=True)
    dias_restantes = models.IntegerField(null=True)
    activo = models.NullBooleanField()

    def __unicode__(self):
        return  self.estado_vacacion.nombre


class CargaFamiliar(models.Model):
    nombre = models.CharField(max_length=140, null=True)
    edad = models.IntegerField()
    trabajador = models.ForeignKey(Trabajador)

    def __unicode__(self):
        return self.edad


class BoletaTrabajador(models.Model):
    boleta_inicial = models.IntegerField(default = 1)
    boleta_final = models.IntegerField(default = 2)
    actual = models.IntegerField(default = 1)
    trabajador = models.ForeignKey(Trabajador)
    fecha_creacion = models.DateTimeField(auto_now_add = True)
    fecha_modificacion = models.DateTimeField(auto_now = True)
    activo = models.NullBooleanField()

    objects = BoletaTrabajadorManager()


class GuiaTrabajador(models.Model):
    guia_inicial = models.IntegerField(default = 1)
    guia_final = models.IntegerField(default = 2)
    actual = models.IntegerField(default = 1)
    trabajador = models.ForeignKey(Trabajador)
    fecha_creacion = models.DateTimeField(auto_now_add = True)
    fecha_modificacion = models.DateTimeField(auto_now = True)
    activo = models.NullBooleanField()
