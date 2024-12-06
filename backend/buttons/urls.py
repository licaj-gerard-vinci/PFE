from django.urls import path
from .views import Enjeuxx
from .views import Questionss

urlpatterns = [
    path('enjeux/', Enjeuxx.as_view(), name="enjeux"),
    path('questions/', Questionss.as_view(), name="questions")
]