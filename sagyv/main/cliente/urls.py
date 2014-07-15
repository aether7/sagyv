from django.conf.urls import patterns, url

urlpatterns = patterns("main.cliente.views",
	url(r"^$", "index", name="index"),
    url(r'^obtener/(?P<id_cliente>\d+)/$', "obtener_cliente", name="obtener"),
    url(r"^crear/$", "crear_cliente", name="crear"),
    url(r"^modificar/$", "modificar_cliente", name="modificar"),
    url(r"^eliminar/$", "eliminar_cliente", name="eliminar"),
    url(r"^crear\-situacion\-comercial/$", "crear_situacion_comercial",name="crear_situacion_comercial"),
)
