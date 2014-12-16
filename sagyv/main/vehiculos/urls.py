from django.conf.urls import patterns, url

urlpatterns = patterns("main.vehiculos.views",
    url(r"^$","index",name="index"),
    url(r"^agregar\-nuevo\-vehiculo/$", "agregar_nuevo_vehiculo", name="agregar_nuevo_vehiculo"),
    url(r"^anexar\-vehiculo/$", "anexar_vehiculo", name="anexar_vehiculo"),
    url(r"^modificar\-vehiculo/$","modificar", name="modificar"),
    url(r"^obtener/$", "obtener_vehiculos", name="obtener_vehiculos"),
)
