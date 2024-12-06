from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client
from .serializers import ClientSerializer

class CompanyListView(APIView):
    def get(self, request):
        companies = Client.objects.select_related('id_template').all()
        serializer = ClientSerializer(companies, many=True)
        return Response(serializer.data)