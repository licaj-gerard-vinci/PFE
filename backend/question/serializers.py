from rest_framework import serializers
from .models import Question,ChoixReponse,ReponseClient  

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id_question', 'sujet', 'statut', 'id_enjeu', 'est_ouverte']




class ChoixReponseSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(source='id_question')  # Sérialiser la question liée

    class Meta:
        model = ChoixReponse
        fields = ['id_reponse', 'question', 'texte', 'score_individuelle', 'id_template', 'champ_libre', 'score_engagement']


class ReponseClientSerializer(serializers.ModelSerializer):
    # Optionnel : Si tu veux inclure des informations sur la réponse et la question dans les données retournées
    reponse = ChoixReponseSerializer(source='id_reponse', read_only=True)

    class Meta:
        model = ReponseClient
        fields = [
            'id_reponse_client', 'id_client', 'id_reponse', 'commentaire', 'rep_aujourd_hui',
            'rep_dans_2_ans', 'score_final', 'sa_reponse', 'id_engagement'
        ]