from django.urls import path
from .views import RegisterView, LoginView, Subtitles

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('enjeux/', Subtitles.as_view(), name="enjeux"),
]