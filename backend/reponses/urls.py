from django.urls import path
from .views import AddVerificationView, ValidateQuestionView, GetVerificationsView

urlpatterns = [
    path('verifications/<int:client_id>/add/', AddVerificationView.as_view(), name='add-verification'),
    path('verifications/validerReponse/<int:verification_id>/', ValidateQuestionView.as_view(), name='validate-verification'),
    path('verifications/client/<int:client_id>/', GetVerificationsView.as_view(), name='get-verifications'),
]
