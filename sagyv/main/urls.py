from django.conf.urls import patterns, url, include

urlpatterns = patterns("main.views",
    url(r"^$","panel_control",name="panel_control"),
)

urlpatterns += patterns("",
    url(r"^liquidacion/",include("main.liquidacion.urls",namespace="liquidacion")),
    url(r"^bodega/",include("main.bodega.urls",namespace="bodega")),
    url(r"^cliente/",include("main.cliente.urls",namespace="cliente")),
    url(r"^vehiculos/",include("main.vehiculos.urls",namespace="vehiculos")),
    url(r"^precios/",include("main.precios.urls",namespace="precios")),
    url(r"^trabajador/",include("main.trabajador.urls",namespace="trabajador")),
    url(r"^reportes/", include("main.reportes.urls",namespace="reportes")),
)
