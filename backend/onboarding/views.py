from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from onboarding.models import Client, QuestionsOnboarding


class OnboardingView(APIView):
    def post(self, request):
        data = request.data
        try:
            client = Client.objects.create(
                prenom=data['prenom'],
                nom=data['nom'],
                adresse_mail=data['adresse_mail'],
                fonction=data['fonction'],
                nom_entreprise=data['nom_entreprise'],
                numero_tva=data['numero_tva'],
                forme_juridique=data['forme_juridique'],
                adresse_siege_social=data['adresse_siege_social'],
                adresse_site_web=data['adresse_site_web'],
                code_nace_activite_principal=data['code_nace_activite_principal'],
                chiffre_affaire_du_dernier_exercice_fiscal=data['chiffre_affaire_du_dernier_exercice_fiscal'],
                franchise=data['franchise'],
                nombre_travailleurs=data['nombre_travailleurs'],
                litige_respect_loi_social_environnemental=data['litige_respect_loi_social_environnemental'],
                honnete=data['honnete'],
                soumission_demande_de_subside_pour_le_label=data['soumission_demande_de_subside_pour_le_label'],
                partenaire_introduction=data['partenaire_introduction'],
                ajouter_autre_chose=data['ajouter_autre_chose'],
                remarque_commentaire_precision=data['remarque_commentaire_precision'],
                date_de_soumission=data['date_de_soumission'],
                est_valide="FALSE",
                mdp="test132"
            )
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
          return Response(status=status.HTTP_400_BAD_REQUEST)

class QuestionView(APIView):
    def get(self, request):
        questions = QuestionsOnboarding.objects.all()
        return Response([{'id': question.id_question, 'question': question.question} for question in questions])