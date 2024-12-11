from django.urls import path
from .views import Enjeuxx
from .views import Questionss
from .views import ResponsessClient
from .views import Responses
from .views import TemplatessClients
from .views import GetQuestionsAndReponsesView, SauvegardeReponseClientView, getQuestionsUser, SetClientTermineView

urlpatterns = [
    path('enjeux/', Enjeuxx.as_view(), name="enjeux"),
    path('questions/', Questionss.as_view(), name="questions"),
    path('responsesClient/', ResponsessClient.as_view(), name="responsesClient"),
    path('responses/', Responses.as_view(), name = "responses"),
    path('questionsReponses/', GetQuestionsAndReponsesView.as_view(), name='get_questions_and_reponses'),
    path('sauvegarderReponse/', SauvegardeReponseClientView.as_view(), name='sauvegarder_reponse_client'),
    path('templates/', TemplatessClients.as_view(), name='templates_client'),
    path('questionsUser/', getQuestionsUser.as_view(), name='questions_user'),
    path('set_client_termine/', SetClientTermineView.as_view(), name='set_client_termine'),
]