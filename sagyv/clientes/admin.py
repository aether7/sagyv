from django.contrib import admin
from .models import *


class RegionAdmin(admin.ModelAdmin):
    list_display = ("id","nombre","orden",)
    list_editable = ("nombre","orden",)
    ordering = ("id",)


class ComunaAdmin(admin.ModelAdmin):
    list_display = ("id","nombre","region",)
    list_editable = ("nombre","region",)
    ordering = ("id",)


class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "giro", "direccion","telefono", "rut","es_lipigas", "es_propio")
    list_editable = ("giro", "telefono", "rut", "es_lipigas", "es_propio")
    ordering = ("id",)


class DescuentoClienteAdmin(admin.ModelAdmin):
    list_display = ("id","monto_descuento","tipo_descuento",)
    list_editable = ("monto_descuento", "tipo_descuento")
    ordering = ("id",)

admin.site.register(Region, RegionAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(DescuentoCliente, DescuentoClienteAdmin)
