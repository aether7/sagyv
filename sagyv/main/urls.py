from django.conf.urls import patterns, url, include

urlpatterns = patterns("main.views",
    url(r"^$","panel_control",name="panel_control"),
)

urlpatterns += patterns("",
    url(r"^liquidacion/",include("main.liquidacion.urls")),
)
