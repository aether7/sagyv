from django.conf.urls import patterns, url

urlpatterns = patterns("main.views",
    url(r"^$","panel_control",name="panel_control"),
)
