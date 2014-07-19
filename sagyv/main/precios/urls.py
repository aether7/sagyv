from django.conf.urls import patterns, url

urlpatterns = patterns("main.precios.views",
    url(r"^$","index",name="index"),
)
