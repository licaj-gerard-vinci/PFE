from django.urls import path
from .views import GlossairesView

urlpatterns = [
    path('all/', GlossairesView.as_view(), name='glossaires'),
]