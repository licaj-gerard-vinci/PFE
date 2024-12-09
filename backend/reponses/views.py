from sys import modules

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ReponseClient, Verification
from authentication.models import Admin  # Si les Admins sont définis dans l'application `authentication`
from django.shortcuts import get_object_or_404

# Create your views here.

class AddVerificationView(APIView):
    #todo: Add permission_classes to restrict access to only admins
    def post(self, request, client_id):
        '''
        Crée des vérifications pour chaque réponse du client spécifié.
        :param client_id: L'ID du client pour lequel les vérifications doivent être créées
        :param request: La requête HTTP
        :return: Un message de succès ou d'erreur

        Exemple de route:
        POST /verifications/1/add/

        Exemple de corps de requête:
        {
            "id_admin": 1
        }

        '''

        # Récupérer les données de la requête
        admin_id = request.data['id_admin'] # Assurez-vous que l'utilisateur connecté est un admin
        try:

            # Vérifiez si l'utilisateur est bien un admin
            admin = get_object_or_404(Admin, id_admin=admin_id)

            print(admin.email)

            # Récupérez toutes les réponses du client spécifié
            reponses_clients = ReponseClient.objects.filter(id_client=client_id)
            if not reponses_clients.exists():
                print("🔴 line 41: ", reponses_clients)
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
            print("🔴?? line 58: ", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

