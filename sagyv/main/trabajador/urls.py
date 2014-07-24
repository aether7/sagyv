from django.conf.urls import patterns, url

urlpatterns = patterns("main.trabajador.views",
    url(r"^$","index",name="index"),
)
