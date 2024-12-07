from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .models import Admin
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.db import connection


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
            with connection.cursor() as cursor:
                # Récupérer les informations du client
                cursor.execute("""
                    SELECT nom, prenom, adresse_mail, nom_entreprise, code_nace_activité_principal, chiffre_affaire_du_dernier_exercice_fiscal, nombre_travailleurs 
                    FROM shiftingpact_db.clients
                    WHERE id_client = %s
                """, [client_id])
                client_data = cursor.fetchone()
                if not client_data:
                    return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

                # Récupérer les engagements liés au client
                cursor.execute("""
                    SELECT e.engagement, e.commentaire, e.kpis, e.date
                    FROM shiftingpact_db.engagements e
                    JOIN shiftingpact_db.reponse_client rc ON rc.id_engagement = e.id_engagement
                    WHERE rc.id_client = %s
                """, [client_id])
                engagements = cursor.fetchall()

                # Récapitulatif des scores du client
                cursor.execute("""
                    SELECT SUM(rc.score_final) AS score_total, COUNT(rc.id_reponse_client) AS total_reponses
                    FROM shiftingpact_db.reponse_client rc
                    WHERE rc.id_client = %s
                """, [client_id])
                scores = cursor.fetchone()

                # Résumé des métriques
                cursor.execute("""
                    SELECT est_metrique, est_formalisation, est_pratique, est_sensible, est_reporting
                    FROM shiftingpact_db.recaps
                    WHERE id_client = %s
                """, [client_id])
                recaps = cursor.fetchone()

                # Construire la réponse
                rapport_data = {
                    "client": {
                        "nom": client_data[0],
                        "prenom": client_data[1],
                        "email": client_data[2],
                        "nom_entreprise": client_data[3],
                        "code_nace": client_data[4],
                        "chiffre_affaire": client_data[5],
                        "nombre_travailleurs": client_data[6],
                    },
                    "engagements": [
                        {"engagement": e[0], "commentaire": e[1], "kpi": e[2], "date": e[3]} for e in engagements
                    ],
                    "scores": {
                        "score_total": scores[0] if scores else 0,
                        "total_reponses": scores[1] if scores else 0,
                    },
                    "recaps": {
                        "est_metrique": recaps[0] if recaps else False,
                        "est_formalisation": recaps[1] if recaps else False,
                        "est_pratique": recaps[2] if recaps else False,
                        "est_sensible": recaps[3] if recaps else False,
                        "est_reporting": recaps[4] if recaps else False,
                    }
                }
            return Response(rapport_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
