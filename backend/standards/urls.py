from django.urls import path
from .views import StandardsView

urlpatterns = [
    path('all/', StandardsView.as_view(), name='standards'),
]