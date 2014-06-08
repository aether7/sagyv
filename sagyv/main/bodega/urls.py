from django.conf.urls import patterns,url

urlpatterns = patterns("main.bodega.views",
    url(r"^$","index",name="bodega"),
    url(r"^update_stock_producto/$", "update_stock_producto", name="update_stock_producto"),
)
