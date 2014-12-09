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
    list_display = ("id", "codigo", "nombre", "peso", "tipo_producto", "stock",)
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

class VehiculoAdmin(admin.ModelAdmin):
    list_display = ("id","patente",)
    list_editable = ("patente",)
    ordering = ("id",)

class TerminalAdmin(admin.ModelAdmin):
    list_display = ("id","codigo","vehiculo")
    list_editable = ("codigo","vehiculo")
    ordering = ("id",)

class TrabajadorAdmin(admin.ModelAdmin):
    list_display = ("id","nombre", "apellido", "rut")
    list_editable = ("nombre", "apellido")
    ordering =("id",)

class TrabajadorVehiculoAdmin(admin.ModelAdmin):
    list_display = ("id", "trabajador", "vehiculo","fecha","activo")
    list_editable = ("trabajador","vehiculo")
    ordering = ("-id",)

class TipoPagoAdmin(admin.ModelAdmin):
    list_display = ("id","nombre")
    list_editable = ("nombre",)
    ordering = ("id",)

class TipoDescuentoAdmin(admin.ModelAdmin):
    list_display = ("id","tipo",)
    list_editable = ("tipo",)
    ordering = ("id",)

class DescuentoClienteAdmin(admin.ModelAdmin):
    list_display = ("id","monto_descuento","tipo_descuento",)
    list_editable = ("monto_descuento", "tipo_descuento")
    ordering = ("id",)

class VoucherAdmin(admin.ModelAdmin):
    list_display = ("id","tipo_tarjeta" , "tipo_cuotas", "terminal", "numero_tarjeta", "numero_operacion", "codigo_autorizacion", "numero_cuotas")
    list_editable = ("tipo_tarjeta", "tipo_cuotas", "terminal", "numero_tarjeta", "numero_operacion", "codigo_autorizacion", "numero_cuotas")
    ordering = ("-id",)

class CuotaVoucherAdmin(admin.ModelAdmin):
    list_display = ("id","voucher", "monto", "pagado",)
    list_editable = ("voucher", "monto", "pagado")
    ordering = ("-id",)

class BancoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre","cheques_recibidos")
    list_editable = ("nombre","cheques_recibidos")
    ordering = ("id",)

admin.site.register(Region, RegionAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(TipoProducto, TipoProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(TipoTarjeta, TipoTarjetaAdmin)
admin.site.register(TarjetaCredito, TarjetaCreditoAdmin)
admin.site.register(Vehiculo,VehiculoAdmin)
admin.site.register(Trabajador,TrabajadorAdmin)
admin.site.register(Terminal,TerminalAdmin)
admin.site.register(TrabajadorVehiculo,TrabajadorVehiculoAdmin)
admin.site.register(TipoPago,TipoPagoAdmin)
admin.site.register(TipoDescuento,TipoDescuentoAdmin)
admin.site.register(DescuentoCliente,DescuentoClienteAdmin)
admin.site.register(Voucher,VoucherAdmin)
admin.site.register(CuotaVoucher,CuotaVoucherAdmin)
admin.site.register(StockVehiculo)
admin.site.register(EstadoTerminal)
admin.site.register(Banco, BancoAdmin)
