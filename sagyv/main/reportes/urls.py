from django.conf.urls import patterns, url

urlpatterns = patterns("main.reportes.views",
    url(r"^$", "index", name="index"),
    url(r"^consumo\-clientes/$", "consumo_clientes", name="consumo_clientes"),
    url(r"^compras\-gas/$", "compras_gas", name="compras_gas"),
    url(r"^kilos\-vendidos/$", "kilos_vendidos", name="kilos_vendidos"),
    url(r"^creditos/$", "creditos", name="creditos"),
    url(r"^venta\-masa/$", "venta_masa", name="venta_masa"),
    url(r"^obtener\-consumo/$", "obtener_consumo", name="obtener_consumo"),
)
