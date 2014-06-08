from django.conf.urls import patterns,url

urlpatterns = patterns("main.bodega.views",
    url(r"^$","index",name="bodega"),
    url(r"^agregar_stock_compra/$", "agregar_stock_compra", name="agregar_stock_compra"),
)
