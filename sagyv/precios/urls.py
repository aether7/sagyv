from django.conf.urls import patterns, url

urlpatterns = patterns("precios.views",
    url(r"^$", "index", name="index"),
    url(r"^update/$", "update_precios", name="update_precios"),
    url(r"^update\-stock/$", "update_stock", name="update_stock"),
    url(r"^obtener\-productos/$", "obtener_productos", name="obtener_productos"),
    url(r"^obtener\-garantias/$", "obtener_garantias", name="obtener_garantias"),
    url(r"^obtener\-stocks/$", "obtener_stocks", name="obtener_stocks"),
)
