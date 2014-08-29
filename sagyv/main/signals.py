# -*- coding: utf-8 -*-

from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from gadjo.requestprovider.signals import get_request
from .models import LogSistema
from .models import Cliente, DescuentoCliente

NUEVO_REGISTRO = "Se ha creado un nuevo registro en "
EDIT_REGISTRO = "Se ha actualizado un registro en "
DELETE_REGISTRO = "Se ha eliminado un registro en "

def obtener_create_update(kwargs):
    fue_creado = kwargs["created"]
    texto = ""

    if fue_creado:
        texto = NUEVO_REGISTRO
    else:
        texto = EDIT_REGISTRO

    return texto

def save(texto, instance, fue_creado):
    user = get_request().user
    texto += instance.__class__.__name__ + " por el usuario " + user.username

    log = LogSistema()
    log.descripcion = texto
    log.tipo_accion = tipo_accion
    log.tabla = instance.__class__.__name__
    log.user = user
    log.registro_id = instance.id
    log.save()


@receiver(post_save, sender=DescuentoCliente, dispatch_uid="save:situacion_comercial")
def save_situacion_comercial(sender, instance, **kwargs):
    tipo_accion = kwargs["created"] and LogSistema.CREAR or LogSistema.ACTUALIZAR
    texto = obtener_create_update(kwargs)
    save(texto, instance, tipo_accion)


@receiver(post_save, sender=Cliente, dispatch_uid="save:cliente")
def save_cliente(sender, **kwargs):
    tipo_accion = kwargs["created"] and LogSistema.CREAR or LogSistema.ACTUALIZAR
    texto = obtener_create_update(kwargs)
    save(texto, instance, tipo_accion)

@receiver(post_delete, sender=Cliente, dispatch_uid="delete:cliente")
def delete_cliente(sender, **kwargs):
    save(DELETE_REGISTRO, instance, LogSistema.BORRAR)
