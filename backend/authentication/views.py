from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from backend.models import Admin, Clients
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken, TokenError
import re

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if is_valid_email_domain(data['email']):
            return Response({"error": "Email invalide"}, status=status.HTTP_400_BAD_REQUEST)
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

        if not is_valid_email_domain(email):  # Si l'email contient 'admin' ou 'BetterBusiness'
            try:
                user = Admin.objects.get(email=email)
            except Admin.DoesNotExist:
                return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                user = Clients.objects.get(email=email)
            except Client.DoesNotExist:
                return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

            # Vérifie si le mot de passe est correct
        if check_password(password, user.mdp):
            # Génère un token JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

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

def get_client_by_email(request, email):
    try:
        # Filtre pour trouver le Client par son email
        client = Clients.objects.values(
            'id_client', 'prenom', 'nom', 'email', 'fonction', 'nom_entreprise', 'forme_juridique',
            'adresse_siege_social', 'adresse_site_web', 'code_nace_activite_principal',
            'chiffre_affaire_du_dernier_exercice_fiscal', 'franchise', 'nombre_travailleurs',
            'litige_respect_loi_social_environnemental', 'honnete', 'soumission_demande_de_subside_pour_le_label',
            'ajouter_autre_chose', 'remarque_commentaire_precision', 'date_de_soumission', 'est_valide'
        ).get(email=email)  # Exclut 'mdp' en ne le sélectionnant pas explicitement

        return JsonResponse(client, safe=False)  # Retourne les données JSON
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client not found'}, status=404)


def is_valid_email_domain(email):
    """
    Vérifie si l'email n'a pas un domaine contenant 'admin' ou 'BetterBusiness'.
    """
    domain = email.split('@')[-1]  # Récupère le domaine après @
    return not re.search(r'(admin|BetterBusiness)', domain, re.IGNORECASE)

