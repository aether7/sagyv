from django.conf.urls import patterns, url

urlpatterns = patterns("main.guias.views",
    url(r"^$", "index", name="index"),
)

urlpatterns += patterns("main.guias.terminales_views",
    url(r"^terminales/$", "obtener_terminales", name="obtener_terminales"),
)
