from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from onboarding.models import Client, QuestionsOnboarding


from rest_framework.exceptions import ValidationError

class OnboardingView(APIView):
    def post(self, request):
        data = request.data
        print(data)
        try:
            # Valider les champs attendus
            required_fields = [
                'prenom', 'nom', 'adresse_mail', 'fonction',
                'nom_entreprise', 'numero_tva', 'forme_juridique',
                'adresse_siege_social', 'adresse_site_web',
                'code_nace_activite_principal', 'chiffre_affaire_du_dernier_exercice_fiscal',
                'franchise', 'nombre_travailleurs', 'litige_respect_loi_social_environnemental',
                'honnete', 'soumission_demande_de_subside_pour_le_label',
                'ajouter_autre_chose', 'remarque_commentaire_precision', 'date_de_soumission'
            ]
            for field in required_fields:
                if field not in data:
                    raise ValidationError(f"Le champ '{field}' est manquant.")
            
            # Créer l'objet Client
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
                franchise=data['franchise'] == "true",  # Convertir en booléen
                nombre_travailleurs=data['nombre_travailleurs'],
                litige_respect_loi_social_environnemental=data['litige_respect_loi_social_environnemental'] == "true",
                honnete=data['honnete'] == "true",
                soumission_demande_de_subside_pour_le_label=data['soumission_demande_de_subside_pour_le_label'] == "true",
                partenaire_introduction=data['partenaire_introduction'],
                ajouter_autre_chose=data['ajouter_autre_chose'] == "true",
                remarque_commentaire_precision=data['remarque_commentaire_precision'],
                date_de_soumission=data['date_de_soumission'],
                id_template_id=1,
                est_valide=False,
                mdp="test132"
            )
            return Response(status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class QuestionView(APIView):
    def get(self, request):
        questions = QuestionsOnboarding.objects.all()
        return Response([{'id': question.id_questions_onboarding, 'question': question.question} for question in questions])