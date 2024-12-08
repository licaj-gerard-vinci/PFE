from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum
from backend.models import Clients, Engagements, ReponseClient, Recaps

# Create your views here.
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