from django.urls import path
from .views import GetQuestionsAndReponsesView, SauvegardeReponseClientView

urlpatterns = [
    path('questionsReponses/', GetQuestionsAndReponsesView.as_view(), name='get_questions_and_reponses'),
    path('sauvegarderReponse/', SauvegardeReponseClientView.as_view(), name='sauvegarder_reponse_client'),
]
