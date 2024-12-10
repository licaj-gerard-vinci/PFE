from sys import modules

from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ReponseClient, Verification
from authentication.models import Admin  # Si les Admins sont définis dans l'application `authentication`
from django.shortcuts import get_object_or_404


# Create your views here.

class AddVerificationView(APIView):
    # todo: Add permission_classes to restrict access to only admins
    def post(self, request, client_id):
        '''
        Crée des vérifications pour toutes les réponses d'un client spécifié.
        :param client_id: L'ID du client pour lequel les vérifications doivent être créées
        :param request: La requête HTTP
        :return: Un message de succès ou d'erreur

        Exemple de route:
        POST /verifications/1/add/

        Exemple de corps de requête:
        {
            "id_admin": 1
        }

        Exemple de réponse:
        {
            "message": "Vérifications créées pour toutes les réponses du client 1."
        }

        '''

        # Récupérer les données de la requête
        admin_id = request.data['id_admin']  # Assurez-vous que l'utilisateur connecté est un admin
        try:

            # Vérifiez si l'utilisateur est bien un admin
            admin = get_object_or_404(Admin, id_admin=admin_id)

            # Récupérez toutes les réponses du client spécifié
            reponses_clients = ReponseClient.objects.filter(id_client=client_id)
            if not reponses_clients.exists():
                return Response({"error": "Aucune réponse trouvée pour ce client."}, status=status.HTTP_404_NOT_FOUND)
            # Créer les vérifications pour chaque réponse du client
            for reponse_client in reponses_clients:
                Verification.objects.create(
                    id_reponse_client=reponse_client,
                    est_valide=False,  # Par défaut non validé
                    id_admin=admin.id_admin
                )

            return Response(
                {"message": f"Vérifications créées pour toutes les réponses du client {client_id}."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ValidateQuestionView(APIView):
    def post(self, request, verification_id):
        '''
        Valide une vérification spécifique.
        :param verification_id: L'ID de la vérification à valider
        :param request: La requête HTTP
        :return: Un message de succès ou d'erreur
        '''
        # Récupérer l'ID de l'admin depuis la requête
        admin_id = request.data.get('id_admin')

        # Validation de l'ID de l'admin
        if not admin_id:
            return Response({"error": "L'ID de l'admin est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Vérifiez que l'admin existe
            admin = get_object_or_404(Admin, id_admin=admin_id)
        except Http404:
            return Response({"error": "Admin non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Récupérer la vérification spécifique
            verification = get_object_or_404(Verification, id_reponse_client=verification_id)

            # Valider la vérification
            verification.est_valide = True
            verification.save()

            # Retourner un succès
            return Response(
                {"message": f"Vérification {verification_id} validée avec succès."},
                status=status.HTTP_200_OK
            )

        except Http404:
            return Response({"error": "Vérification non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erreur inattendue : {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class GetVerificationsView(APIView):
    def get(self, request, client_id):
        '''
        Récupère toutes les vérifications pour un client spécifié.
        :param client_id: L'ID du client pour lequel les vérifications doivent être récupérées
        :return: Les vérifications pour le client spécifié

        Exemple de route:
        GET /verifications/client/1/

        Exemple de réponse:
        [
            {
                "id_verification": 1,
                "id_reponse_client": 1,
                "est_valide": False,
                "id_admin": 1
            },
            {
                "id_verification": 2,
                "id_reponse_client": 2,
                "est_valide": False,
                "id_admin": 1
            }
        ]
        '''

        try:
            # Récupérer toutes les vérifications pour le client spécifié
            reponses_clients = ReponseClient.objects.filter(id_client=client_id)
            if not reponses_clients.exists():
                return Response({"error": "Aucune réponse trouvée pour ce client."}, status=status.HTTP_404_NOT_FOUND)
            verifications = Verification.objects.filter(id_reponse_client__in=reponses_clients)
            if not verifications.exists():
                return Response({"error": "Aucune vérification trouvée pour ce client."},
                                status=status.HTTP_404_NOT_FOUND)
            # Récupérer les données de chaque vérification
            data = []
            for verification in verifications:
                data.append({
                    "id_verification": verification.id_reponse_client.id_reponse_client,
                    "id_reponse_client": verification.id_reponse_client.id_reponse_client,
                    "est_valide": verification.est_valide,
                    "id_admin": verification.id_admin
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print("2🔴 BAD REQUEST: ", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
