from django.urls import path
from .views import AddVerificationView, ValidateQuestionView, GetVerificationsView, DeleteReponseClientView, \
    UpdateReponseClientView, AddReponseClientView, GetEngagementsView, CheckAllVerificationsValidView

urlpatterns = [
    path('verifications/<int:client_id>/add/', AddVerificationView.as_view(), name='add-verification'),
    path('verifications/validerReponse/<int:verification_id>/', ValidateQuestionView.as_view(), name='validate-verification'),
    path('verifications/client/<int:client_id>/', GetVerificationsView.as_view(), name='get-verifications'),
    path('reponse_client/<int:reponse_client_id>/delete/', DeleteReponseClientView.as_view(), name='delete-reponse-client'),
    path('reponse_client/reponse_libre/<int:reponse_client_id>/update/', UpdateReponseClientView.as_view(), name='update-reponse-client'),
    path('reponse_client/reponse_verifier/add', AddReponseClientView.as_view(), name='add-reponse-verifier'),
    path('engagements/list_engagements/client/<int:client_id>/' , GetEngagementsView.as_view(), name='get-engagements'),
    path('verifications/client/<int:client_id>/status/', CheckAllVerificationsValidView.as_view(), name='check-verifications-status'),
]