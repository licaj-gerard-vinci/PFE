from django.urls import path
from .views import Enjeuxx
from .views import Questionss
from .views import ResponsessClient
from .views import Responses
from .views import GetQuestionsAndReponsesView, SauvegardeReponseClientView

urlpatterns = [
    path('enjeux/', Enjeuxx.as_view(), name="enjeux"),
    path('questions/', Questionss.as_view(), name="questions"),
    path('responsesClient/', ResponsessClient.as_view(), name="responsesClient"),
    path('responses/', Responses.as_view(), name = "responses"),
    path('questionsReponses/', GetQuestionsAndReponsesView.as_view(), name='get_questions_and_reponses'),
    path('sauvegarderReponse/', SauvegardeReponseClientView.as_view(), name='sauvegarder_reponse_client'),
]