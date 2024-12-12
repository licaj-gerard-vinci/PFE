from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Glossaires

class GlossairesView(APIView):
    def get(self, request):
        glossaires = Glossaires.objects.all()
        glossaires_list = list(glossaires.values())
        return JsonResponse(glossaires_list, safe=False)
