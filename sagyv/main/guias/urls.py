from django.conf.urls import patterns, url

urlpatterns = patterns("main.guias.views",
    url(r"^$", "index", name="index"),
)

urlpatterns += patterns("main.guias.terminales_views",
    url(r"^terminales/$", "obtener_terminales", name="obtener_terminales"),
    url(r"^crear\-terminal/$", "crear_terminal", name="crear_terminal"),
    url(r"^remover\-terminal/$", "remover_terminal", name="remover_terminal"),
    url(r"^maintenance/$", "maintenance", name="maintenance"),
    url(r"reasignar\-terminal/$", "reasignar_terminal", name="reasignar_terminal"),
    url(r"return\-maintenance/$", "return_maintenance", name="return_maintenance"),
)
