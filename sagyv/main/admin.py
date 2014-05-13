from django.contrib import admin
from main.models import *

class RegionAdmin(admin.ModelAdmin):
    list_display = ("id","nombre","orden",)
    list_editable = ("nombre","orden",)
    ordering = ("id",)

class ComunaAdmin(admin.ModelAdmin):
    list_display = ("id","nombre","region",)
    list_editable = ("nombre","region",)
    ordering = ("id",)

class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "giro", "direccion","telefono", "rut",)
    list_editable = ("giro", "direccion", "telefono", "rut", )
    ordering = ("id",)

class TipoProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    list_editable = ("nombre",)
    ordering = ("id",)

class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "codigo", "nombre", "peso", "tipo_producto",)
    list_editable = ("codigo", "nombre", "peso", "tipo_producto",)
    ordering = ("id",)

class TipoTarjetaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre",)
    list_editable = ("nombre",)
    ordering = ("id",)

class TarjetaCreditoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "codigo", "tipo_tarjeta")
    list_editable = ("nombre", "codigo", "tipo_tarjeta")
    ordering = ("id",)

admin.site.register(Region, RegionAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(TipoProducto, TipoProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(TipoTarjeta, TipoTarjetaAdmin)
admin.site.register(TarjetaCredito, TarjetaCreditoAdmin)
