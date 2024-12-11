from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import Admin, ReponseClient, Verifications, Reponses, Clients
from django.shortcuts import get_object_or_404


# Create your views here.

class AddVerificationView(APIView):
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
                Verifications.objects.create(
                    id_reponse_client=reponse_client,
                    est_valide=False,  # Par défaut non validé
                    id_admin=admin
                )

            return Response(
                {"message": f"Vérifications créées pour toutes les réponses du client {client_id}."},
                status=status.HTTP_201_CREATED
            )
        except Http404:
            return Response({"error": "Admin non trouvé."}, status=status.HTTP_404_NOT_FOUND)
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
            verification = get_object_or_404(Verifications, id_reponse_client=verification_id)

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
            verifications = Verifications.objects.filter(id_reponse_client__in=reponses_clients)
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
                    "id_admin": verification.id_admin.id_admin
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteReponseClientView(APIView):
    def delete(self, request, reponse_client_id):
        '''
        Supprime une réponse client et sa vérification associée si la question de la réponse client a au moins une autre réponse.
        :param reponse_client_id: L'ID de la réponse client à supprimer.
        :param request: La requête HTTP.
        :return: Un message de succès ou d'erreur.
        '''
        try:
            # Récupérer la réponse client spécifique
            reponse_client = get_object_or_404(ReponseClient, id_reponse_client=reponse_client_id)
            # Récupérer la question associée via la relation
            question = reponse_client.id_reponse.id_question
            # Récupérer toutes les réponses client pour cette question
            reponses_clients = ReponseClient.objects.filter(id_reponse__id_question=question.id_question)

            # Vérifier si la question a plus d'une réponse
            if reponses_clients.count() > 1:
                # Supprimer la réponse client
                reponse_client.delete()

                # Supprimer la vérification associée, si elle existe
                verification = Verifications.objects.filter(id_reponse_client=reponse_client_id).first()
                if verification:
                    verification.delete()

                # Retourner un succès
                return Response(
                    {"message": f"Réponse client {reponse_client_id} supprimée avec succès."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Impossible de supprimer la réponse car la question n'a qu'une seule réponse."},
                    status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({"error": "Réponse client non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erreur inattendue : {str(e)}"}, status=status.HTTP_412_PRECONDITION_FAILED)


class UpdateReponseClientView(APIView):
    def put(self, request, reponse_client_id):
        '''
        Modifie le contenu d'une réponse client si le champ libre est activé.
        :param reponse_client_id: L'ID de la réponse client à modifier.
        :param request: La requête HTTP.
        :return: Un message de succès ou d'erreur.

        Exemple de route:
        PUT /reponse_client/1/update/
        Exemple de corps de requête:
        {
            "contenu": "Nouveau contenu de la réponse",
            "score_final": 10
        }

        Exemple de réponse:
        {
            "message": "Réponse client 1 modifiée avec succès."
        }

        '''

        try:
            # Vérifier si le contenu et le score_final sont présents dans la requête
            if 'contenu' not in request.data or 'score_final' not in request.data:
                return Response({"error": "Le contenu et le score final sont requis."},
                                status=status.HTTP_400_BAD_REQUEST)
            # Récupérer la réponse client spécifique
            reponse_client = get_object_or_404(ReponseClient, id_reponse_client=reponse_client_id)

            reponse = Reponses.objects.get(id_reponse=reponse_client.id_reponse.id_reponse)
            # Vérifier si le champ libre est activé
            if reponse.champ_libre:
                # Modifier le contenu de la réponse client
                reponse.texte = request.data.get('contenu')

                # Modifier le score final de la réponse client
                reponse.score_final = request.data.get('score_final')

                reponse.save()
                reponse_client.save()

                # Retourner un succès
                return Response(
                    {"message": f"Réponse client {reponse_client_id} modifiée avec succès."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response({"error": "Impossible de modifier la réponse car le champ libre n'est pas activé."},
                                status=status.HTTP_412_PRECONDITION_FAILED)

        except Http404:
            return Response({"error": "Réponse client non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erreur inattendue : {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class AddReponseClientView(APIView):
    def post(self, request):
        """
            Crée une réponse client si elle n'existe pas.
            :param request: La requête HTTP.
            :return: Un message de succès ou d'erreur.

            Exemple de route:
            POST /reponse_client/reponse_verifier/add
            Exemple de corps de requête:
            {
                "id_reponse": 1,
                "id_client": 1,
                "est_engagement": false,
                "id_admin": 1,
            }

            Exemple de réponse:
            {
                "message": "Réponse client créée avec succès."
            }
        """
        try:
            # Vérifier si l'id de la réponse, l'id du client, l'est_engagement et l'id de l'admin sont présents dans la requête
            if 'id_reponse' not in request.data or 'id_client' not in request.data or 'est_engagement' not in request.data or 'id_admin' not in request.data:
                return Response(
                    {"error": "L'ID de la réponse, l'ID du client, l'engagement et l'ID de l'admin sont requis."},
                    status=status.HTTP_400_BAD_REQUEST)

            try:
                # Vérifiez que l'admin existe
                admin = get_object_or_404(Admin, id_admin=request.data['id_admin'])
            except Http404:
                return Response({"error": "Admin non trouvé."}, status=status.HTTP_404_NOT_FOUND)
            # Récupérer la réponse spécifique
            reponse_client = ReponseClient.objects.filter(id_reponse=request.data['id_reponse'],
                                                          id_client=request.data['id_client'])
            if reponse_client.exists():
                return Response({"error": "La réponse client existe déjà."}, status=status.HTTP_412_PRECONDITION_FAILED)

            reponse = get_object_or_404(Reponses, id_reponse=request.data['id_reponse'])

            client = get_object_or_404(Clients, id_client=request.data['id_client'])  # Retrieve the Clients instance

            # Créer la réponse client
            reponse_client = ReponseClient.objects.create(
                id_reponse=reponse,
                id_client=client,  # Assign the Clients instance
                est_un_engagement=request.data['est_engagement'],
                score_final=1080
            )

            # Créer la vérification associée
            Verifications.objects.create(
                id_reponse_client=reponse_client,
                est_valide=True,
                id_admin=admin
            )

            # Récupérer la réponse client spécifique
            reponse_client = ReponseClient.objects.get(id_reponse=reponse, id_client=client)
            # Modifier le score final de la réponse client

            if reponse_client.est_un_engagement:
                reponse_client.score_final = reponse.score_engagement
            else:
                reponse_client.score_final = reponse.score_individuel

            reponse_client.save()

            # Retourner un succès
            return Response(
                {"message": "Réponse client créée avec succès."},
                status=status.HTTP_201_CREATED
            )

        except Http404:
            return Response({"error": "Réponse non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erreur inattendue : {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


