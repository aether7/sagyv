from django.conf.urls import patterns, url, include

urlpatterns = patterns('main.views',
    url(r'^$','panel_control',name='panel_control'),
)

urlpatterns += patterns("",
    url(r"^liquidacion/",include("main.liquidacion.urls",namespace="liquidacion")),
    url(r"^bodega/",include("main.bodega.urls",namespace = "bodega")),
    url(r"^precios/",include("main.precios.urls",namespace="precios")),
    url(r"^guias/", include("main.guias.urls", namespace="guias")),
)
