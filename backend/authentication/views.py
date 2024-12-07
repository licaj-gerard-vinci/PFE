from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .models import Admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.http import JsonResponse

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = Admin.objects.create(
                nom=data['nom'],
                prenom=data['prenom'],
                email=data['email'],
                mdp=make_password(data['mdp']),
                role="admin"
            )
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        data = request.data
        user = authenticate(email=data['email'], mdp=data['mdp'])
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

def get_admin_by_email(request, email):
    try:
        # Filtre pour trouver l'Admin par son email
        admin = Admin.objects.values(
            'id_admin', 'nom', 'prenom', 'email', 'role'
        ).get(email=email)  # Exclut 'mdp' en ne le sélectionnant pas explicitement

        return JsonResponse(admin, safe=False)  # Retourne les données JSON
    except Admin.DoesNotExist:
        return JsonResponse({'error': 'Admin not found'}, status=404)