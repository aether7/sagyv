from datetime import date

def convierte_texto_fecha(texto):
   aux = [int(x) for x in texto.split("-")]
   nueva_fecha = date(aux[0], aux[1], aux[2])
   return nueva_fecha

def convierte_fecha_texto(fecha):
    nueva_fecha = str(fecha.year) + "-" + str(fecha.month) + "-" + str(fecha.day)
    return nueva_fecha
