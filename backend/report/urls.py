
from django.urls import path
from .views import RapportView

urlpatterns = [
    path('<int:client_id>/', RapportView.as_view(), name='rapport'),

]