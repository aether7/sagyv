from django.contrib.auth.models import User, Group

def variables_roles(req):
    #inicialmente estaba puesto req.user.is_superuser pero no pescaba tanto en windows como linux
    es_admin = req.user.id == 1

    return {
        "es_admin" : True
    }
