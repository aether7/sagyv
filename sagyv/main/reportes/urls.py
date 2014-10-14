from django.conf.urls import patterns, url

urlpatterns = patterns("main.reportes.views",
    url(r"^$", "index", name="index"),
    url(r"^consumo\-clientes/$", "consumo_clientes", name="consumo_clientes"),
)
