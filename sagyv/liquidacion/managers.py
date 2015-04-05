from django.db import models
from django.db.models import Q, Sum

from utils import enums


class TarjetaCreditoManager(models.Manager):
    def get_tarjetas_comerciales(self):
        resultados = self.filter(tipo_tarjeta_id=enums.TipoTarjeta.COMERCIAL)
        return resultados

    def get_tarjetas_bancarias(self):
        resultados = self.filter(
            Q(tipo_tarjeta_id=enums.TipoTarjeta.DEBITO) |
            Q(tipo_tarjeta_id=enums.TipoTarjeta.CREDITO)
        ).order_by("-tipo_tarjeta")

        return resultados


class TerminalManager(models.Manager):
    def get_activos(self):
        return self.filter(estado_id=enums.EstadoTerminal.ACTIVO).order_by('id')
