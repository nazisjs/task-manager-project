from django.urls import path
from .views import hello_api

urlpatterns = [
    path('api/hello/', hello_api),
]