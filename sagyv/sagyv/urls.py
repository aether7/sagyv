from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^dashboard/',include('main.urls')),
    url(r'^trabajador/', include('trabajador.urls', namespace = 'trabajador')),
    url(r'^clientes/', include('clientes.urls', namespace = 'clientes')),
    url(r'^vehiculos/', include('vehiculo.urls', namespace = 'vehiculos')),
    url(r'^bodega/', include('bodega.bodega_urls', namespace = 'bodega')),
    url(r'^reportes/', include('reportes.urls', namespace = 'reportes')),
    url(r'^precios/', include('precios.urls', namespace = 'precios')),
)

urlpatterns += patterns('',
    url(r'^$','main.views.index',name='index'),
    url(r'^login/$','main.views.login',name='login'),
    url(r'^logout/$','main.views.logout',name='logout'),
)
