from django.conf.urls import patterns, url

urlpatterns = patterns("main.cliente.views",
	url(r"^$", "index", name="cliente"),
    url(r'^obtener_cliente/(?P<id_cliente>\d+)/$', "obtener_cliente", name="obtener_cliente"),
    url(r"^cliente_existe/$", "cliente_existe", name="cliente_existe"),
    url(r"^crear_cliente/$", "crear_cliente", name="crear_cliente"),
    url(r"^modificar_cliente/$", "modificar_cliente", name="modificar_cliente"),
    url(r"^crear_situacion_comercial/$", "crear_situacion_comercial",name="crear_situacion_comercial"),
)