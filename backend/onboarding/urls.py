from django.urls import path
from .views import QuestionView, OnboardingView

urlpatterns = [
    path('questions/', QuestionView.as_view(), name='qustions'),
    path('submit/', OnboardingView.as_view(), name='submit'),
]