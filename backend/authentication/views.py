from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.db.models import Count, Sum
from backend.models import Clients, Engagements, ReponseClient, Recaps

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
    



class RapportView(APIView):
    def get(self, request, client_id):
        try:
            # Récupérer les informations du client
            client = Clients.objects.filter(id_client=client_id).first()
            if not client:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            # Récupérer les engagements liés au client via ReponseClient
            engagements = Engagements.objects.filter(
                reponseclient__id_client=client_id
            ).values("engagement", "commentaire", "kpis", "date")

            # Récapitulatif des scores
            scores = ReponseClient.objects.filter(id_client=client_id).aggregate(
                score_total=Sum('score_final'),
                total_responses=Count('id_reponse_client')
            )

            # Récupérer les métriques liées au client
            recaps = Recaps.objects.filter(id_client=client_id).values(
                "est_metrique", "est_formalisation", "est_pratique", "est_sensible", "est_reporting"
            ).first()

            # Construire la réponse
            rapport_data = {
                "client": {
                    "prenom": client.prenom,
                    "nom": client.nom,
                    "adresse_mail": client.adresse_mail,
                    "nom_entreprise": client.nom_entreprise,
                    "code_nace_activite_principal": client.code_nace_activite_principal,
                    "chiffre_affaire_du_dernier_exercice_fiscal": client.chiffre_affaire_du_dernier_exercice_fiscal,
                    "nombre_travailleurs": client.nombre_travailleurs,
                },
                "engagements": list(engagements),
                "scores": {
                    "score_total": scores["score_total"] or 0,
                    "total_responses": scores["total_responses"] or 0,
                },
                "recaps": recaps or {},
            }

            return Response(rapport_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
