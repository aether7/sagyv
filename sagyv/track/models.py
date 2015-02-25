from django.db import models
from django.contrib.auth.models import User


class LogSistema(models.Model):
    CREAR = 1
    ACTUALIZAR = 2
    BORRAR = 3
    descripcion = models.TextField(null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    tipo_accion = models.IntegerField()
    user = models.ForeignKey(User)
    tabla = models.CharField(max_length=140)
    registro_id = models.IntegerField()
