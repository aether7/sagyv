#-*- coding: utf-8 -*-
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView, View
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from django.contrib.auth import login as log_in
from django.contrib.auth import logout as log_out
from django.core.urlresolvers import reverse

class IndexView(TemplateView):
    template_name = "index.html"

    def get(self, req):
        if req.user.is_authenticated():
            return redirect(reverse("panel_control"))

        return render(req, self.template_name)


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



class LogoutView(View):
    def get(self, request):
        log_out(request)
        return redirect(reverse("index"))

index = IndexView.as_view()
login = LoginView.as_view()
panel_control = login_required(TemplateView.as_view(template_name="panel_control.html"))
logout = LogoutView.as_view()
