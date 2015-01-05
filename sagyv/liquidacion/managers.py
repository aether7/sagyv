from django.db import connections, models, connection
from django.db.models import Q, Sum

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


class TarjetaCreditoManager(models.Manager):
    TARJETA_CREDITO = 1
    TARJETA_DEBITO = 2
    TARJETA_COMERCIAL = 3

    def get_tarjetas_comerciales(self):
        resultados = self.filter(tipo_tarjeta_id = self.TARJETA_COMERCIAL)
        return resultados

    def get_tarjetas_bancarias(self):
        resultados = self.filter(
            Q(tipo_tarjeta_id = self.TARJETA_DEBITO) |
            Q(tipo_tarjeta_id = self.TARJETA_CREDITO)
        ).order_by("-tipo_tarjeta")

        return resultados


class TerminalManager(models.Manager):
    def get_activos(self):
        return self.filter(estado_id = 1).order_by('id')
