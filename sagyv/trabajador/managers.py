from django.db import models

class BoletaTrabajadorManager(models.Manager):
    def get_talonario_activo(self, trabajador_id):
        talonarios = self.filter(trabajador_id = trabajador_id, activo = True).order_by('-id')

        return len(talonarios) > 0 and talonarios[0] or None

    def obtener_por_trabajador(self, trabajador):
        qs = self.filter(trabajador = trabajador, activo = True).order_by('-id')

        if qs.exists():
            return qs[0]
        else:
            return None
