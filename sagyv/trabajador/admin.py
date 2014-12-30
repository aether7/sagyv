from django.contrib import admin
from trabajador.models import *

class GenericAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    list_editable = ('nombre',)
    ordering = ('id',)

class TrabajadorAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','apellido','rut','domicilio','fecha_inicio_contrato','afp','sistema_salud','estado_civil')
    list_editable = ('nombre','apellido','domicilio','afp','sistema_salud','estado_civil')
    ordering = ('id',)

admin.site.register(Afp, GenericAdmin)
admin.site.register(SistemaSalud, GenericAdmin)
admin.site.register(EstadoCivil, GenericAdmin)
admin.site.register(EstadoVacacion, GenericAdmin)
admin.site.register(Trabajador, TrabajadorAdmin)
