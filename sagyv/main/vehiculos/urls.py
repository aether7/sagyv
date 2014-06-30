from django.conf.urls import patterns, url

urlpatterns = patterns("main.vehiculos.views",
    url(r"^$","index",name="vehiculos"),
    url(r"^agregar\-nuevo\-vehiculo/$", "agregar_nuevo_vehiculo", name="agregar_nuevo_vehiculo"),
)
