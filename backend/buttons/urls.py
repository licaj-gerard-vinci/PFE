from django.urls import path
from .views import Subtitles

urlpatterns = [
    path('enjeux/', Subtitles.as_view(), name="enjeux"),
]