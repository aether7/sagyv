from django.conf.urls import patterns, url

urlpatterns = patterns("liquidacion.views",
    url(r"^$","index",name="index"),
    url(r"^balance\-liquidacion/$", "balance_liquidacion", name="balance_liquidacion"),
    url(r"^obtener\-guia/$", "obtener_guia", name="obtener_guia"),
    url(r"^obtener\-garantias/$", "obtener_garantias", name="obtener_garantias"),
    url(r"^buscar\-cliente/$","buscar_cliente", name="buscar_cliente"),
    url(r'^cerrar/$', "cerrar", name="cerrar"),
)
