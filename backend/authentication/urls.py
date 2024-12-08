from django.urls import path
from .views import RegisterView, LoginView, get_admin_by_email, VerifyTokenView, get_client_by_email

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('admin/<str:email>/', get_admin_by_email, name='get_admin_by_email'),
    path('client/<str:email>/', get_client_by_email, name='get_client_by_email'),
]