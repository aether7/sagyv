from django.contrib.auth.decorators import permission_required

def permiso_admin(fn):
    return permission_required("is_superuser")(fn)
