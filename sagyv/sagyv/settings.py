"""
Django settings for sagyv project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '*k#9n$x8&_5s)p=p*rd2e5o*dv*3qp=nfq&5jilgq%w9otww)o'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Sebastian Real', 'sebastian.real@rlay.cl'),
    ('Norman Glaves', 'norman.glaves@rlay.cl'),
    ('Francisco Reyes', 'francisco.reyes@rlay.cl'),
)

ALLOWED_HOSTS = [".rlay.cl"]

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main',
    'trabajador',
    'bodega',
    'vehiculo',
    'clientes',
    'liquidacion',
    'reportes',
    'precios',
    'guias',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'sagyv.urls'

WSGI_APPLICATION = 'sagyv.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'sagyv_db',
        'USER': 'sagyv_user',
        'PASSWORD': 'sagyv_password'
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'es-CL'
TIME_ZONE = 'America/Santiago'
USE_I18N = True
USE_L10N = True
USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = "/home/rlay/webapps/sagyv_assets_static/"
MEDIA_ROOT = "/home/rlay/webapps/sagyv_assets_media/"

CSRF_COOKIE_NAME = "andreacsrftoken"

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static/'),
)

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.CachedStaticFilesStorage'

#SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.PickleSerializer'

EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "rlaysystems@gmail.com"
EMAIL_HOST_PASSWORD = "realreyes"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

TEMPLATE_CONTEXT_PROCESSORS += (
    "main.context_processors.variables_roles",
)

LOGIN_URL = '/'

FIXTURE_DIRS = (
    os.path.join(BASE_DIR, 'fixtures/'),
)

try:
    from .local_settings import *
except ImportError:
    pass
