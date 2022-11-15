import os, sys

from django.core.wsgi import get_wsgi_application

sys.path.append(os.path.dirname(__file__))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')

app = get_wsgi_application()