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
