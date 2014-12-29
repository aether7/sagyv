from django.contrib import admin
from main.models import *

class TrabajadorAdmin(admin.ModelAdmin):
    list_display = ("id","nombre", "apellido", "rut")
    list_editable = ("nombre", "apellido")
    ordering =("id",)

admin.site.register(Trabajador,TrabajadorAdmin)
