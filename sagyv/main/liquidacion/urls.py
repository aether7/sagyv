from django.conf.urls import patterns, url

urlpatterns = patterns("main.liquidacion.views",
    url(r"^$","index",name="liquidacion"),
)