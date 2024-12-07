from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import CustomUser
from .models import Admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken, TokenError

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
        email = request.data.get('email')
        password = request.data.get('mdp')

        try:
            # Recherche de l'utilisateur dans la base de données
            admin = Admin.objects.get(email=email)

            # Vérifie si le mot de passe est correct
            if check_password(password, admin.mdp):
                # Génère un token JWT
                refresh = RefreshToken.for_user(admin)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

        except Admin.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class VerifyTokenView(APIView):
    permission_classes = [AllowAny]  # Permet d'accéder sans authentification

    def post(self, request):
        token = request.data.get("token")  # Récupérer le token dans le corps de la requête

        if not token:
            return Response({"error": "Token manquant"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Décoder et vérifier le token
            access_token = AccessToken(token)
            email = access_token["user_id"]  # Extraire l'email depuis le payload
            return Response({"email": email}, status=status.HTTP_200_OK)

        except TokenError as e:
            # En cas d'erreur (token invalide ou expiré)
            return Response({"error": "Token invalide ou expiré"}, status=status.HTTP_401_UNAUTHORIZED)

def get_admin_by_email(request, email):
    try:
        # Filtre pour trouver l'Admin par son email
        admin = Admin.objects.values(
            'id_admin', 'nom', 'prenom', 'email', 'role'
        ).get(email=email)  # Exclut 'mdp' en ne le sélectionnant pas explicitement

        return JsonResponse(admin, safe=False)  # Retourne les données JSON
    except Admin.DoesNotExist:
        return JsonResponse({'error': 'Admin not found'}, status=404)