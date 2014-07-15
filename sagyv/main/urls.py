from django.conf.urls import patterns, url, include

urlpatterns = patterns("main.views",
    url(r"^$","panel_control",name="panel_control"),
)

urlpatterns += patterns("",
    url(r"^liquidacion/",include("main.liquidacion.urls")),
    url(r"^bodega/",include("main.bodega.urls",namespace="bodega")),
    url(r"^cliente/",include("main.cliente.urls",namespace="cliente")),
    url(r"^vehiculos/",include("main.vehiculos.urls")),
)
