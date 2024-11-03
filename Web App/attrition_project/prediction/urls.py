# prediction/urls.py
from django.urls import path
from .views import predict_attrition

urlpatterns = [
    path('predict/', predict_attrition, name='predict_attrition'),
]
