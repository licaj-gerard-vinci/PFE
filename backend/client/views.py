# backend/client/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client, Template
from .serializers import ClientSerializer, TemplateSerializer
from rest_framework import status
from rest_framework.generics import RetrieveAPIView

class TemplateListView(APIView):
    def get(self, request):
        templates = Template.objects.all()
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data)

class CompanyListView(APIView):
    def get(self, request):
        companies = Client.objects.prefetch_related('templates').all()
        serializer = ClientSerializer(companies, many=True)
        return Response(serializer.data)

class CompanyDetailView(RetrieveAPIView):
    queryset = Client.objects.prefetch_related('templates').all()
    serializer_class = ClientSerializer
    lookup_field = 'id_client'

class CompanyUpdateView(APIView):
    def put(self, request, id_client):
        try:
            company = Client.objects.get(id_client=id_client)
            serializer = ClientSerializer(company, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Client.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id_client):
        try:
            company = Client.objects.get(id_client=id_client)
            serializer = ClientSerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Client.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)