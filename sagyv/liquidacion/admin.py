from django.contrib import admin
from liquidacion.models import *


class TipoTarjetaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre",)
    list_editable = ("nombre",)
    ordering = ("id",)


class TarjetaCreditoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "codigo", "tipo_tarjeta")
    list_editable = ("nombre", "codigo", "tipo_tarjeta")
    ordering = ("id",)


class TerminalAdmin(admin.ModelAdmin):
    list_display = ("id","codigo","movil")
    list_editable = ("codigo","movil")
    ordering = ("id",)


class BancoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre","cheques_recibidos")
    list_editable = ("nombre","cheques_recibidos")
    ordering = ("id",)


admin.site.register(TipoTarjeta, TipoTarjetaAdmin)
admin.site.register(TarjetaCredito, TarjetaCreditoAdmin)
admin.site.register(Terminal, TerminalAdmin)
admin.site.register(Banco, BancoAdmin)
