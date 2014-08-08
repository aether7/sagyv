from django.conf.urls import patterns, url

urlpatterns = patterns("main.liquidacion.views",
    url(r"^$","index",name="liquidacion"),
    url(r"^balance\-liquidacion/$", "balance_liquidacion", name="balance_liquidacion"),
    url(r"^obtener\-guia/$", "obtener_guia", name="obtener_guia"),
)
