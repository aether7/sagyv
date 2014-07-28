from django.conf.urls import patterns, url

urlpatterns = patterns("main.trabajador.views",
    url(r"^$","index",name="index"),
    url(r"^obtener/$","obtener",name="obtener"),
    url(r"^crear/$","crear",name="crear"),
    url(r"^modificar/$","modificar",name="modificar"),
    url(r"^eliminar/$","eliminar",name="eliminar")
)
