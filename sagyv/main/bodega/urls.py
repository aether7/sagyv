from django.conf.urls import patterns,url

urlpatterns = patterns("main.bodega.views",
    url(r"^$","index",name="index"),
    url(r"^crea\-guia/$","crea_guia", name="crea_guia"),
    url(r"^obtener\-vehiculos\-por\-producto/$", "obtener_vehiculos_por_producto", name="obtener_vehiculos_por_producto"),
)
