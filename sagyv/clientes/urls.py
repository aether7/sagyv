from django.conf.urls import patterns, include, url

urlpatterns = patterns('clientes.views',
    url(r'^$', 'index', name='index'),
    url(r'^obtener/$', 'obtener_cliente', name='obtener'),
    url(r'^crear/$', 'crear_cliente', name='crear'),
    url(r'^modificar/$', 'modificar_cliente', name='modificar'),
    url(r'^eliminar/$', 'eliminar_cliente', name='eliminar'),
    url(r'^buscar/$','buscar_cliente', name='buscar_cliente'),
    url(r'^validar\-cliente/$', 'validar_cliente', name='validar_cliente'),
)

urlpatterns += patterns('clientes.situacion_comercial_views',
    url(r'^crear\-situacion\-comercial/$', 'crear_situacion_comercial', name='crear_situacion_comercial'),
    url(r'^modificar\-situacion\-comercial/$', 'modificar_situacion_comercial', name='modificar_situacion_comercial'),
    url(r'^obtener\-situacion\-comercial/$', 'obtener_situacion_comercial', name='obtener_situacion_comercial'),
)
