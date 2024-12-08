from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Enjeux
from .models import Questions
from .models import ReponseClient
from .models import Reponse
from django.http import JsonResponse


class Enjeuxx(APIView):
    def get(self, request):
        enjeux = Enjeux.objects.all().values("id_enjeu","nom","enjeu_parent")
        enjeux_list = list(enjeux)
        return JsonResponse(enjeux_list, safe=False)
    
class Questionss(APIView):
    def get(self, request):
        questions = Questions.objects.all().values("id_question","sujet","id_enjeu")
        questions_list = list(questions)
        return JsonResponse(questions_list, safe=False)
    
class ResponsessClient(APIView):
    def get(self, request):
        _id_client= int(request.query_params.get('id_client'))
        responses_client = ReponseClient.objects.filter(id_client = _id_client).values("id_reponse_client","id_client","id_reponse")
        responses_client_list = list(responses_client)
        return JsonResponse(responses_client_list, safe=False)

class Response(APIView):
    def get(self, request):
        _id_reponse = int(request.query_params.get('id_reponse'))
        response = Reponse.objects.filter(id_reponse=_id_reponse).values("id_reponse", "id_question").first()
        return JsonResponse(response, safe=False)


    