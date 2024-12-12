from django.urls import path
from .views import RapportView

urlpatterns = [
    path('', RapportView.as_view(), name='rapport'),  # Pas d'ID dans l'URL
]
