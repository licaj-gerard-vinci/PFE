from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Enjeux
from .models import Questions
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
    