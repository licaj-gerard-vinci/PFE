from django.urls import path
from .views import AddVerificationView

urlpatterns = [
    path('verifications/<int:client_id>/add/', AddVerificationView.as_view(), name='add-verification'),
]
