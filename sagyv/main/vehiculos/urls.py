from django.conf.urls import patterns, url

urlpatterns = patterns("main.vehiculos.views",
    url(r"^$","index",name="vehiculos"),
)
