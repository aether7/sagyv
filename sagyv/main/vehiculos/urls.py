from django.conf.urls import patterns, url

urlpatterns = patterns("main.vehiculos.views",
    url(r"^$","index",name="index"),
    url(r"^agregar\-nuevo\-vehiculo/$", "agregar_nuevo_vehiculo", name="agregar_nuevo_vehiculo"),
    url(r"^obtener/(?P<id_vehiculo>\d+)/$","obtener",name="obtener"),
    url(r"^anexar\-vehiculo/$", "anexar_vehiculo", name="anexar_vehiculo"),
    url(r"^modificar\-vehiculo/$","modificar_vehiculo", name="modificar"),
)
