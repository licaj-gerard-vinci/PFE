from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Standards

class StandardsView(APIView):
    def get(self, request):
        standards = Standards.objects.all()
        standards_list = list(standards.values())
        return JsonResponse(standards_list, safe=False)
