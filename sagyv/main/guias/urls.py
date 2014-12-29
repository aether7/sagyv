from django.conf.urls import patterns, url

urlpatterns = patterns("main.guias.views",
    url(r"^$", "index", name="index"),
)

urlpatterns += patterns("main.guias.terminales_views",
    url(r"^terminales/$", "obtener_terminales", name="obtener_terminales"),
    url(r"^crear\-terminal/$", "crear_terminal", name="crear_terminal"),
    url(r"^remover\-terminal/$", "remover_terminal", name="remover_terminal"),
    url(r"^editar\-terminal/$", "editar_terminal", name="editar_terminal"),
    url(r"reasignar\-terminal/$", "reasignar_terminal", name="reasignar_terminal"),
    url(r"^maintenance/$", "maintenance", name="maintenance"),
    url(r"^return\-maintenance/$", "return_maintenance", name="return_maintenance"),
)

urlpatterns += patterns("main.guias.talonarios_views",
    url(r"^obtener\-talonarios/$", "obtener_talonarios", name="obtener_talonarios"),
    url(r"^crear\-talonario/$", "crear_talonario", name="crear_talonario"),
    url(r"^editar\-talonario/$", "editar_talonario", name="editar_talonario"),
    url(r"eliminar\-talonario/$", "eliminar_talonario", name="eliminar_talonario"),
)

urlpatterns += patterns("main.guias.guias_views",
    url(r"^obtener\-guias/$", "obtener_guias", name="obtener_guias"),
    url(r"^crear\-guias/$", "crear_guias", name="crear_guias"),
    url(r"^editar\-guias/$", "editar_guias", name="editar_guias"),
    url(r"^eliminar\-guias/$", "eliminar_guias", name="eliminar_guias"),
)
