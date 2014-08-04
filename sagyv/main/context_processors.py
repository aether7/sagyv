from django.contrib.auth.models import User, Group

def variables_roles(req):
    es_admin = req.user.is_superuser

    return {
        "es_admin" : es_admin
    }
