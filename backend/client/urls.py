from django.urls import path
from .views import CompanyListView, CompanyDetailView, CompanyUpdateView, TemplateListView

urlpatterns = [
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:id_client>/', CompanyDetailView.as_view(), name='company-detail'),
    path('companies/<int:id_client>/update/', CompanyUpdateView.as_view(), name='company-update'),  
    path('templates/', TemplateListView.as_view(), name='template-list'),
]