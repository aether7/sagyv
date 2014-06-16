from django.conf.urls import patterns, url

urlpatterns = patterns("main.cliente.views",
	url(r"^$", "index", name="cliente"),
)