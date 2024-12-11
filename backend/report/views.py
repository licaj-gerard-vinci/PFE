from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Case, When, FloatField
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from backend.models import Clients, ReponseClient, Reponses, Enjeux, Engagements

class RapportView(APIView):
    def get(self, request):
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return Response({"error": "Token manquant ou invalide"},
                                status=401)

            token = auth_header.split(" ")[1]

            # Décodage du token en utilisant la logique de VerifyTokenView
            try:
                access_token = RefreshToken(token)
                email = access_token["user_id"]
            except TokenError:
                return Response({"error": "Token invalide ou expiré"}, status=401)

             # Remplacer par un ID dynamique
            client = Clients.objects.filter(email=email).first()
            if not client:
                return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

            # Récupérer les réponses associées au client et exclure celles avec texte="N/A"
            reponse_clients = ReponseClient.objects.filter(id_client=client.id_client).filter(
                id_reponse__texte__isnull=False
            ).exclude(id_reponse__texte="N/A")

            # Initialiser les scores
            score_actuel = {"E": 0, "S": 0, "G": 0}
            score_engagement = {"E": 0, "S": 0, "G": 0}
            max_scores = {"E": 0, "S": 0, "G": 0}
            domain_data = []

            # Définir les plages de questions par module
            modules = {
                "E": {"range": range(1, 34), "name": "Environnement"},
                "S": {"range": range(34, 65), "name": "Social"},
                "G": {"range": range(65, 91), "name": "Gouvernance"},
            }

            # Parcourir les réponses client et calculer les scores
            for reponse_client in reponse_clients:
                question_id = reponse_client.id_reponse.id_question.id_question
                module = next((k for k, v in modules.items() if question_id in v["range"]), None)
                if not module:
                    continue

                # Calculer le score max pour la question
                question_responses = Reponses.objects.filter(id_question=question_id)
                max_score_question = question_responses.aggregate(
                    max_score=Sum('score_individuel')
                )['max_score'] or 0.0
                max_score_question /= 2.0  # Diviser par 2 comme précisé

                # Ajouter au score max du module
                max_scores[module] += max_score_question

                # Ajouter au score actuel
                score_actuel[module] += reponse_client.score_final

                # Calculer le score d'engagement
                if reponse_client.est_un_engagement:
                    score_engagement[module] += reponse_client.id_reponse.score_engagement

            # Construire les données par domaine
            for module, details in modules.items():
                domain_data.append({
                    "id": module,
                    "name": details["name"],
                    "score_actuel": round(score_actuel[module], 2),
                    "score_engagement": round(score_engagement[module], 2),
                    "score_max": round(max_scores[module], 2),
                })

            # Calculer le total des scores
            total_max = sum(max_scores.values())
            total_score_actuel = sum(score_actuel.values())
            total_score_engagement = sum(score_engagement.values())

            # Score total normalisé (limité à 100%)
            if total_max > 0:
                score_total_percentage = ((total_score_actuel + total_score_engagement) / total_max) * 100
                score_total_percentage = min(score_total_percentage, 100)  # Limiter à 100%
            else:
                score_total_percentage = 0

            # Définir le niveau
            niveau = "Insuffisant"
            if score_total_percentage >= 25:
                niveau = "Bon"
            if score_total_percentage >= 50:
                niveau = "Très bon"
            if score_total_percentage >= 75:
                niveau = "Excellent"

            # Retourner les données du rapport
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
                    "score_actuel": round(total_score_actuel, 2),
                    "score_engagement": round(total_score_engagement, 2),
                    "score_total": round(score_total_percentage, 2),
                    "niveau": niveau,
                },
                "domains": domain_data
            }
            return Response(rapport_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
