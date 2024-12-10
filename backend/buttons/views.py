from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Enjeux
from .models import Question
from .models import ReponseClient
from .models import ChoixReponse
from .models import TemplateClient
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
        responses_client = ReponseClient.objects.filter(id_client = _id_client).values("id_reponse_client","id_client","id_reponse", "rep_aujourd_hui")
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


