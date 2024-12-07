from django.urls import path
from .views import RegisterView, LoginView, RapportView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('rapport/<int:client_id>/', RapportView.as_view(), name='rapport'),
]