from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Case, When, FloatField
from backend.models import Clients, ReponseClient, Reponses, Enjeux, Engagements, Questions

class RapportView(APIView):
    def get(self, request):
        try:
            client_id = 1  # Remplacer par l'ID dynamique
            client = Clients.objects.filter(id_client=client_id).first()
            if not client:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            # Filtrer les enjeux liés au client
            enjeux_ids = ReponseClient.objects.filter(id_client=client_id).values_list(
                'id_reponse__id_question__id_enjeu', flat=True
            ).distinct()
            enjeux = Enjeux.objects.filter(id_enjeu__in=enjeux_ids)

            # Récupérer les questions liées aux enjeux
            questions = Questions.objects.filter(id_enjeu__in=enjeux)
            
            # Calcul des scores max par question
            max_scores_by_question = {}
            for question in questions:
                max_score = Reponses.objects.filter(id_question=question.id_question).aggregate(
                    max_score=Sum('score_individuel') / 2.0
                )['max_score'] or 0.0
                max_scores_by_question[question.id_question] = max_score
                
            print(max_scores_by_question, "max_scores_by_question")
            print("----------------------------------------------------")
            
            # Calcul des scores clients par enjeu
            scores_clients_by_enjeu = {}
            for enjeu in enjeux:
                scores_clients_by_enjeu[enjeu.id_enjeu] = ReponseClient.objects.filter(
                    id_client=client_id,
                    id_reponse__id_question__id_enjeu=enjeu.id_enjeu
                ).aggregate(
                    total_score=Sum('score_final')
                )['total_score'] or 0.0
                
            print(scores_clients_by_enjeu, "scores_clients_by_enjeu")
            print("----------------------------------------------------")

            # Calcul des scores totaux et normalisation
            score_total = 0.0
            for enjeu_id in enjeux:
                max_score = sum(
                    max_scores_by_question.get(q.id_question, 0.0)
                    for q in questions.filter(id_enjeu=enjeu_id)
                )
                score_client = scores_clients_by_enjeu.get(enjeu_id, 0.0)
                if max_score > 0:
                    score_total += (score_client / max_score)
            
            print(score_total, "score_total")
            print("----------------------------------------------------")

            score_final_percentage = (score_total / len(enjeux)) * 100
            
            print(score_final_percentage, "score_final_percentage")
            print("----------------------------------------------------")

            # Définir le niveau
            niveau = "Insuffisant"
            if score_final_percentage >= 25:
                niveau = "Bon"
            if score_final_percentage >= 50:
                niveau = "Très bon"
            if score_final_percentage >= 75:
                niveau = "Excellent"

            # Préparer la réponse
            rapport_data = {
                "client": {
                    "prenom": client.prenom,
                    "nom": client.nom,
                    "email": client.email,
                    "nom_entreprise": client.nom_entreprise,
                    "fonction": client.fonction,
                    "numero_tva": client.numero_tva,
                    "adresse_siege_social": client.adresse_siege_social,
                    "code_nace_activite_principal": client.code_nace_activite_principal,
                },
                "scores": {
                    "score_total": round(score_final_percentage, 2),
                    "niveau": niveau,
                },
            }
            return Response(rapport_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

