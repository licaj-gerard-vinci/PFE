from django.db import models

class Question(models.Model):
    id_question = models.AutoField(primary_key=True)
    sujet = models.TextField()
    statut = models.CharField(max_length=1)  # Exemple : "A" pour actif
    id_enjeu = models.IntegerField()
    type = models.CharField(max_length=255)

    class Meta:
        db_table = 'questions'  # Utiliser la table PostgreSQL existante
        managed = False  # Django ne gère pas la table (elle existe déjà dans ta DB)


class ChoixReponse(models.Model):
    id_reponse = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(Question, on_delete=models.CASCADE, db_column='id_question')  # Clé étrangère
    texte = models.TextField()
    score_individuelle = models.IntegerField()
    id_template = models.IntegerField()
    champ_libre = models.BooleanField()
    score_engagement = models.IntegerField()
    

    class Meta:
        db_table = 'reponses'  # Utiliser la table PostgreSQL existante
        managed = False  # Django ne gère pas la table (elle existe déjà dans ta DB)


class ReponseClient(models.Model):
    id_reponse_client = models.AutoField(primary_key=True)
    id_client = models.IntegerField()
    id_reponse = models.IntegerField()
    commentaire = models.TextField(null=True, blank=True)
    rep_aujourd_hui = models.CharField(max_length=255, null=True, blank=True)
    rep_dans_2_ans = models.CharField(max_length=255, null=True, blank=True)
    score_final = models.IntegerField(default=0)
    sa_reponse = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'reponse_client'  # Nom de la table dans la base de données
        managed = False  # Indique que Django ne gère pas la création/suppression de la table

