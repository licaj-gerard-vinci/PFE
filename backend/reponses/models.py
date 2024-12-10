from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class Enjeu(models.Model):
    id_enjeu = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    enjeu_parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, db_column='enjeu_parent')

    class Meta:
        db_table = 'enjeux'
        managed = False


class Template(models.Model):
    id_template = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)

    class Meta:
        db_table = 'templates'
        managed = False


class Admin(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    mdp = models.CharField(max_length=255)
    role = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'admin'
        managed = False


class Client(models.Model):
    id_client = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    fonction = models.CharField(max_length=255)
    nom_entreprise = models.CharField(max_length=255)
    forme_juridique = models.TextField()
    adresse_siege_social = models.TextField()
    adresse_site_web = models.TextField()
    code_nace_activite_principal = models.CharField(max_length=255)
    chiffre_affaire_du_dernier_exercice_fiscal = models.IntegerField()
    franchise = models.BooleanField()
    nombre_travailleurs = models.IntegerField()
    litige_respect_loi_social_environnemental = models.BooleanField()
    honnete = models.BooleanField()
    soumission_demande_de_subside_pour_le_label = models.BooleanField()
    ajouter_autre_chose = models.BooleanField()
    remarque_commentaire_precision = models.TextField(null=True, blank=True)
    date_de_soumission = models.DateField()
    est_valide = models.CharField(max_length=255)
    mdp = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'clients'
        managed = False


class Question(models.Model):
    id_question = models.AutoField(primary_key=True)
    sujet = models.CharField(max_length=255)
    statut = models.CharField(max_length=1, choices=[('A', 'Actif'), ('E', 'En attente'), ('C', 'Clos')])
    id_enjeu = models.ForeignKey(Enjeu, on_delete=models.CASCADE, db_column='id_enjeu')
    type = models.CharField(max_length=255)

    class Meta:
        db_table = 'questions'
        managed = False


class Reponse(models.Model):
    id_reponse = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(Question, on_delete=models.CASCADE, db_column='id_question')
    texte = models.TextField(null=True, blank=True)
    score_individuel = models.IntegerField()
    id_template = models.ForeignKey(Template, on_delete=models.CASCADE, db_column='id_template')
    champ_libre = models.BooleanField()
    score_engagement = models.IntegerField()

    class Meta:
        db_table = 'reponses'
        managed = False


class Engagement(models.Model):
    id_engagement = models.AutoField(primary_key=True)
    id_enjeu = models.ForeignKey(Enjeu, on_delete=models.CASCADE, db_column='id_enjeu')
    engagement = models.TextField()
    commentaire = models.TextField(null=True, blank=True)
    id_admin = models.ForeignKey(Admin, on_delete=models.CASCADE, db_column='id_admin')
    kpis = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()

    class Meta:
        db_table = 'engagements'
        managed = False


class ReponseClient(models.Model):
    id_reponse_client = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE,db_column='id_client')
    id_reponse = models.ForeignKey(Reponse, on_delete=models.CASCADE, db_column='id_reponse')
    commentaire = models.TextField(null=True, blank=True)
    est_un_engagement = models.BooleanField()
    score_final = models.IntegerField()
    sa_reponse = models.CharField(max_length=255, null=True, blank=True)
    id_engagement = models.ForeignKey(Engagement, on_delete=models.CASCADE, null=True, blank=True, db_column='id_engagement')

    class Meta:
        db_table = 'reponse_client'
        managed = False


class Verification(models.Model):
    id_reponse_client = models.OneToOneField(ReponseClient, on_delete=models.CASCADE, primary_key=True, db_column='id_reponse_client')
    est_valide = models.BooleanField()
    id_admin = models.IntegerField()

    class Meta:
        db_table = 'verifications'
        managed = False


class Glossaire(models.Model):
    id_glossaire = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255, unique=True)
    definition = models.TextField()
    remarque = models.TextField(null=True, blank=True)
    plus_information = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'glossaires'
        managed = False


class Recap(models.Model):
    id_recap = models.AutoField(primary_key=True)
    id_enjeu = models.ForeignKey(Enjeu, on_delete=models.CASCADE, db_column='id_enjeu')
    id_client = models.OneToOneField(Client, on_delete=models.CASCADE)
    est_metrique = models.BooleanField()
    est_formalisation = models.BooleanField()
    est_pratique = models.BooleanField()
    est_sensible = models.BooleanField()
    est_reporting = models.BooleanField()

    class Meta:
        db_table = 'recaps'
        managed = False


class Standard(models.Model):
    id_standard = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    presentation = models.TextField()
    plus_info = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'standards'
        managed = False


class TemplateClient(models.Model):
    id_template = models.ForeignKey(Template, on_delete=models.CASCADE, db_column='id_template')
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE, db_column='id_client')

    class Meta:
        db_table = 'templates_clients'
        managed = False
        unique_together = ('id_template', 'id_client')
