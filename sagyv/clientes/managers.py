from django.db import connections, models, connection

class ClienteManager(models.Manager):
    def busqueda_por_campo(self, valor, opcion):

        if opcion == "nombre":
            resultados = self.filter(nombre__contains = valor)
        elif opcion == "giro":
            resultados = self.filter(giro__contains = valor)
        elif opcion == "rut":
            resultados = self.filter(rut__contains = valor)
        else:
            resultados = self.all()

        return resultados

    def obtener_propios(self):
        return self.filter(es_propio = True).order_by('id')

    def obtener_lipigas(self):
        return self.filter(es_lipigas = True).order_by('id')
