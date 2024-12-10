from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Case, When, FloatField
from backend.models import Clients, ReponseClient, Reponses, Enjeux, Engagements

class RapportView(APIView):
    def get(self, request):
        try:
            client_id = 1  # Static ID for testing purposes; replace as needed
            client = Clients.objects.filter(id_client=client_id).first()
            if not client:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            # Calculate the current score
            reponse_client = ReponseClient.objects.filter(id_client=client_id)
            score_actuel = reponse_client.aggregate(
                total_score_actuel=Sum(F('score_final') / 2.0, output_field=FloatField())
            )['total_score_actuel'] or 0.0

            # Calculate engagement score
            score_engagement = reponse_client.aggregate(
                total_score_engagement=Sum(
                    Case(
                        When(est_un_engagement=True, then=F('id_reponse__score_individuel') * 0.25),
                        default=0,
                        output_field=FloatField()
                    )
                )
            )['total_score_engagement'] or 0.0

            # Total score
            score_total = score_actuel + score_engagement

            niveau = "Insuffisant"
            if score_total >= 25:
                niveau = "Bon"
            if score_total >= 50:
                niveau = "Très bon"
            if score_total >= 75:
                niveau = "Excellent"

            # Collecting data for domains
            domains = [
                {"id": "E", "name": "Environnemental", "parent_ids": [1, 4, 7, 9]},
                {"id": "S", "name": "Social", "parent_ids": [11, 14, 17, 20]},
                {"id": "G", "name": "Gouvernance", "parent_ids": [23, 28, 32, 35]},
            ]
            domain_data = []

            for domain in domains:
                parent_ids = domain["parent_ids"]

                # Retrieve all sub-enjeux for this domain
                enjeux = Enjeux.objects.filter(enjeu_parent__in=parent_ids)

                # Retrieve engagements linked to these enjeux
                engagements = Engagements.objects.filter(id_enjeu__in=enjeux.values_list("id_enjeu", flat=True))

                # Calculate scores for this domain
                reponses = ReponseClient.objects.filter(id_client=client_id, id_engagement__in=engagements)
                score_actuel_domain = reponses.aggregate(total_score=Sum("score_final"))["total_score"] or 0
                score_engagement_domain = engagements.count() * 10  # Hypothèse : chaque engagement vaut 10 points

                # Prepare engagements as a list
                engagement_list = list(engagements.values_list("engagement", flat=True))

                # Add data for the current domain
                domain_data.append({
                    "id": domain["id"],
                    "name": domain["name"],
                    "score_actuel": round(score_actuel_domain, 2),
                    "score_engagement": round(score_engagement_domain, 2),
                    "engagements": engagement_list,
                })

            # Return response
            rapport_data = {
                "client": {
                    "prenom": client.prenom,
                    "nom": client.nom,
                    "email": client.email,
                    "nom_entreprise": client.nom_entreprise,
                },
                "scores": {
                    "score_actuel": round(score_actuel, 2),
                    "score_engagement": round(score_engagement, 2),
                    "score_total": round(score_total, 2),
                    "niveau": niveau,
                },
                "domains": domain_data,  # Ajout des données par domaine
            }
            return Response(rapport_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
