from django.urls import path
from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
  path('api/ping/', views.GetPongView.as_view()),
  path('', views.index, name='index'),
  url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
]
