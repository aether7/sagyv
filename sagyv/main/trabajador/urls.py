from django.conf.urls import patterns, url

urlpatterns = patterns("main.trabajador.views",
    url(r"^$","index",name="index"),
    url(r"^obtener/(?P<id_trabajador>\d+)/$","obtener",name="obtener"),
    url(r"^validar\-rut/(?P<rut>\d+)/$","validar_rut",name="validar_rut"),
    url(r"^crear/$","crear",name="crear"),
    url(r"^modificar/$","modificar",name="modificar"),
    url(r"^eliminar/$","eliminar",name="eliminar")
)
