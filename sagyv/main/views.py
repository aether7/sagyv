#-*- coding: utf-8 -*-
import json
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView, View
from django.contrib.auth import authenticate
from django.contrib.auth import login as log_in
from django.contrib.auth import logout as log_out
from django.core.urlresolvers import reverse

class LoginView(View):
    def post(self, request):
        usuario = request.POST.get("usuario")
        clave = request.POST.get("clave")

        user = authenticate(username=usuario, password=clave)
        respuesta = {
            "status" : "ok",
            "message" : None,
            "redirect" : None
        }

        if user is not None:
            log_in(self.request, user)
            respuesta["redirect"] = reverse("panel_control")
            respuesta["message"] = "ingreso exitoso"
        else:
            respuesta["status"] = "error"
            respuesta["message"] = "usuario y/o clave erróneos"

        return HttpResponse(json.dumps(respuesta),content_type="application/json")


index = TemplateView.as_view(template_name="index.html")
login = LoginView.as_view()
panel_control = TemplateView.as_view(template_name="panel_control.html")
