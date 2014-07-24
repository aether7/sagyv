from django.conf.urls import patterns,url

urlpatterns = patterns("main.bodega.views",
    url(r"^$","index",name="index"),
    url(r"^update\-stock/$", "update_stock", name="update_stock"),
)
