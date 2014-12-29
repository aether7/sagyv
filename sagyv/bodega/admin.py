from django.contrib import admin
from bodega.models import *

# Register your models here.

class TipoProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    list_editable = ("nombre",)
    ordering = ("id",)

class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "codigo", "nombre", "peso", "tipo_producto", "stock",)
    list_editable = ("codigo", "nombre", "peso", "tipo_producto",)
    ordering = ("id",)

class VehiculoAdmin(admin.ModelAdmin):
    list_display = ("id","patente",)
    list_editable = ("patente",)
    ordering = ("id",)

class TrabajadorVehiculoAdmin(admin.ModelAdmin):
    list_display = ("id", "trabajador", "vehiculo","fecha","activo")
    list_editable = ("trabajador","vehiculo")
    ordering = ("-id",)

admin.site.register(TipoProducto, TipoProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(Vehiculo, VehiculoAdmin)
admin.site.register(TrabajadorVehiculo, TrabajadorVehiculoAdmin)
