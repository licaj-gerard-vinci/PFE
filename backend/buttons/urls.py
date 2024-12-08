from django.urls import path
from .views import Enjeuxx
from .views import Questionss
from .views import ResponsessClient
from .views import Response

urlpatterns = [
    path('enjeux/', Enjeuxx.as_view(), name="enjeux"),
    path('questions/', Questionss.as_view(), name="questions"),
    path('responsesClient/', ResponsessClient.as_view(), name="responsesClient"),
    path('responses/', Response.as_view(), name = "responses")
]