from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Enjeux

class Subtitles(APIView):
    def get(self, request):
        enjeux = Enjeux.objects.filter(enjeu_parent__isnull = True)
        data = [{"id": enjeu.id_enjeu, "nom": enjeu.nom} for enjeu in enjeux]
        return Response(data, status=status.HTTP_200_OK)