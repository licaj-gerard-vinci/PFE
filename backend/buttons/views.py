from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status
from .models import Enjeux
from .models import Question
from .models import ReponseClient
from .models import ChoixReponse
from .models import TemplateClient
from .models import Client
from django.http import JsonResponse
from django.db import IntegrityError


class Enjeuxx(APIView):
    def get(self, request):
        enjeux = Enjeux.objects.all().values("id_enjeu","nom","enjeu_parent")
        enjeux_list = list(enjeux)
        return JsonResponse(enjeux_list, safe=False)
    
class Questionss(APIView):
    def get(self, request):
        questions = Question.objects.all().values("id_question","sujet","id_enjeu")
        questions_list = list(questions)
        return JsonResponse(questions_list, safe=False)
    
class ResponsessClient(APIView):
    def get(self, request):
        _id_client= int(request.query_params.get('id_client'))
        responses_client = ReponseClient.objects.filter(id_client = _id_client).values("id_reponse_client","id_client","id_reponse", "rep_aujourd_hui", "rep_dans_2_ans", "est_un_engagement")
        responses_client_list = list(responses_client)
        return JsonResponse(responses_client_list, safe=False)

class Responses(APIView):
    def get(self, request):
        _id_reponse = int(request.query_params.get('id_reponse'))
        response = ChoixReponse.objects.filter(id_reponse=_id_reponse).values("id_reponse", "id_question", "texte").first()
        return JsonResponse(response, safe=False)

class GetQuestionsAndReponsesView(APIView):
    def get(self, request):
        # Récupérer toutes les questions
        questions = Question.objects.all()
        data = []

        for q in questions:
            # Récupérer les réponses associées à chaque question, sans doublons
            reponses = ChoixReponse.objects.filter(id_question=q.id_question).distinct('texte')

            # Créer une liste des réponses en enlevant les doublons
            reponses_data = [
                {
                    "id_reponse": r.id_reponse,
                    "texte": r.texte,
                    "score_individuel": r.score_individuel,
                    "id_template": r.id_template_id,
                    "champ_libre": r.champ_libre,
                    "score_engagement": r.score_engagement,
                }
                for r in reponses
            ]
            
            # Ajouter la question et ses réponses dans la réponse finale
            data.append({
                "id_question": q.id_question,
                "sujet": q.sujet,
                "statut": q.statut,
                "id_enjeu": q.id_enjeu_id,
                "type": q.type,
                "reponses": reponses_data,  # Associer les réponses ici
            })
        # Retourner toutes les questions avec leurs réponses
        return Response(data)




class SauvegardeReponseClientView(APIView):
    def post(self, request):
        data = request.data

        print("Données reçues :", data)  

        # Vérifie si les champs obligatoires sont présents
        required_fields = ['id_client', 'id_reponse', 'score_final']
        for field in required_fields:
            if field not in data or data[field] is None:
                return Response({"error": f"Le champ {field} est obligatoire."}, status=400)

        try:
            # Insérer les données dans la base
            reponse_client = ReponseClient.objects.create(
                id_client=data['id_client'],
                id_reponse=data['id_reponse'],
                commentaire=data.get('commentaire'),
                rep_aujourd_hui=data.get('rep_aujourd_hui',''),
                rep_dans_2_ans=data.get('rep_dans_2_ans',''),
                est_un_engagement = data.get('est_engagement'),
                score_final= data.get('score_final'),
                sa_reponse= data.get('sa_reponse',''),
                id_engagement = data.get('id_engagement', None)
            )
            return Response({"message": "Réponse sauvegardée avec succès"}, status=201)

        except IntegrityError as e:
            # Gère les erreurs de clé étrangère ou autres contraintes
            return Response({"error": "Erreur d'intégrité des données", "details": str(e)}, status=400)

        except Exception as e:
            # Gère toute autre exception
            print("Erreur :", str(e))
            return Response({"error": str(e)}, status=500)
        
class TemplatessClients(APIView):
    def get(self, request):
            _id_client= int(request.query_params.get('id_client'))
            templates_client = TemplateClient.objects.filter(id_client = _id_client).values("id_template","id_client")
            templates_client_list = list(templates_client)
            return JsonResponse(templates_client_list, safe=False)

class getQuestionsUser(APIView):
    def get(self, request):
        # Récupération du token depuis l'entête Authorization
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Token manquant ou invalide"}, status=401)

        token = auth_header.split(" ")[1]

        # Décodage du token en utilisant la logique de VerifyTokenView
        try:
            access_token = RefreshToken(token)
            email = access_token["user_id"]  
        except TokenError:
            return Response({"error": "Token invalide ou expiré"}, status=401)

        # Récupération du client à partir de l'email
        client = Client.objects.filter(email=email).first()
        if not client:
            return Response({"error": "Client not found"}, status=404)

        # Retourner les données du client
        client_data = {
            "id_client": client.id_client,
            "prenom": client.prenom,
            "nom": client.nom,
            "email": client.email,
            "fonction": client.fonction,
            "nom_entreprise": client.nom_entreprise,
            "numero_tva": client.numero_tva,
            "forme_juridique": client.forme_juridique,
            "adresse_siege_social": client.adresse_siege_social,
            "adresse_site_web": client.adresse_site_web,
            "code_nace_activite_principal": client.code_nace_activite_principal,
            "chiffre_affaire_du_dernier_exercice_fiscal": client.chiffre_affaire_du_dernier_exercice_fiscal,
            "franchise": client.franchise,
            "nombre_travailleurs": client.nombre_travailleurs,
            "raison_refus": client.raison_refus,
            "litige_respect_loi_social_environnemental": client.litige_respect_loi_social_environnemental,
            "honnete": client.honnete,
            "soumission_demande_de_subside_pour_le_label": client.soumission_demande_de_subside_pour_le_label,
            "partenaire_introduction": client.partenaire_introduction,
            "ajouter_autre_chose": client.ajouter_autre_chose,
            "remarque_commentaire_precision": client.remarque_commentaire_precision,
            "date_de_soumission": client.date_de_soumission,
            "est_valide": client.est_valide
        }

        return Response({"client": client_data}, status=200)
    
class SetClientTermineView(APIView):
    def post(self, request):
        id_client = request.data.get('id_client')
        if not id_client:
            return Response({"error": "L'identifiant du client est requis."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            client = Client.objects.get(id_client=id_client)
            client.est_termine = True
            client.save()
            return Response({"message": "Client mis à jour avec succès."}, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"error": "Client introuvable."}, status=status.HTTP_404_NOT_FOUND)
