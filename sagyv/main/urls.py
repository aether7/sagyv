from django.conf.urls import patterns, url, include

urlpatterns = patterns('main.views',
    url(r'^$','panel_control',name='panel_control'),
)

urlpatterns += patterns("",
    url(r"^guias/", include("main.guias.urls", namespace="guias")),
)
