from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$','main.views.index',name="index"),
    url(r'^login/$','main.views.login',name="login"),
    url(r'^panel\-control/',include("main.urls")),
    url(r'^admin/', include(admin.site.urls)),
)
