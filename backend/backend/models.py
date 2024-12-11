# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    mdp = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin'


class Clients(models.Model):
    id_client = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    fonction = models.CharField(max_length=255)
    nom_entreprise = models.CharField(max_length=255)
    numero_tva = models.CharField(max_length=255)
    forme_juridique = models.CharField(max_length=5000)
    adresse_siege_social = models.CharField(max_length=5000)
    adresse_site_web = models.CharField(max_length=5000)
    code_nace_activite_principal = models.CharField(max_length=255)
    chiffre_affaire_du_dernier_exercice_fiscal = models.IntegerField()
    franchise = models.BooleanField()
    nombre_travailleurs = models.IntegerField()
    raison_refus = models.CharField(max_length=5000, blank=True, null=True)
    litige_respect_loi_social_environnemental = models.BooleanField()
    honnete = models.BooleanField()
    soumission_demande_de_subside_pour_le_label = models.BooleanField()
    partenaire_introduction = models.CharField(max_length=255)
    ajouter_autre_chose = models.BooleanField()
    remarque_commentaire_precision = models.CharField(max_length=5000, blank=True, null=True)
    date_de_soumission = models.DateField()
    est_termine = models.BooleanField(blank=True, null=True)
    est_valide = models.CharField(max_length=255)
    mdp = models.CharField(max_length=5000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clients'


class Engagements(models.Model):
    id_engagement = models.AutoField(primary_key=True)
    id_enjeu = models.ForeignKey('Enjeux', models.DO_NOTHING, db_column='id_enjeu')
    engagement = models.CharField(max_length=50000)
    commentaire = models.CharField(max_length=50000, blank=True, null=True)
    kpis = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()

    class Meta:
        managed = False
        db_table = 'engagements'


class Enjeux(models.Model):
    id_enjeu = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    enjeu_parent = models.ForeignKey('self', models.DO_NOTHING, db_column='enjeu_parent', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'enjeux'


class Glossaires(models.Model):
    id_glossaire = models.AutoField(primary_key=True)
    nom = models.CharField(unique=True, max_length=255)
    definition = models.CharField(max_length=5000000)
    remarque = models.CharField(max_length=5000000, blank=True, null=True)
    plus_information = models.CharField(max_length=5000000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'glossaires'


class Questions(models.Model):
    id_question = models.AutoField(primary_key=True)
    sujet = models.CharField(max_length=500)
    statut = models.CharField(max_length=1)
    id_enjeu = models.ForeignKey(Enjeux, models.DO_NOTHING, db_column='id_enjeu')
    type = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'questions'


class QuestionsOnboarding(models.Model):
    id_questions_onboarding = models.AutoField(primary_key=True)
    question = models.CharField(max_length=5000)

    class Meta:
        managed = False
        db_table = 'questions_onboarding'


class Recaps(models.Model):
    id_recap = models.AutoField(primary_key=True)
    id_enjeu = models.ForeignKey(Enjeux, models.DO_NOTHING, db_column='id_enjeu')
    id_client = models.OneToOneField(Clients, models.DO_NOTHING, db_column='id_client')
    est_metrique = models.BooleanField()
    est_formalisation = models.BooleanField()
    est_pratique = models.BooleanField()
    est_sensible = models.BooleanField()
    est_reporting = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'recaps'


class ReponseClient(models.Model):
    id_reponse_client = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Clients, models.DO_NOTHING, db_column='id_client')
    id_reponse = models.ForeignKey('Reponses', models.DO_NOTHING, db_column='id_reponse')
    commentaire = models.CharField(max_length=5000, blank=True, null=True)
    est_un_engagement = models.BooleanField()
    score_final = models.FloatField()
    sa_reponse = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reponse_client'


class Reponses(models.Model):
    id_reponse = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(Questions, models.DO_NOTHING, db_column='id_question')
    texte = models.CharField(max_length=50000, blank=True, null=True)
    score_individuel = models.FloatField()
    id_template = models.ForeignKey('Templates', models.DO_NOTHING, db_column='id_template')
    champ_libre = models.BooleanField()
    score_engagement = models.FloatField()
    id_engagement = models.ForeignKey(Engagements, models.DO_NOTHING, db_column='id_engagement', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reponses'


class Standards(models.Model):
    id_standard = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    presentation = models.CharField(max_length=50000)
    plus_info = models.CharField(max_length=50000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'standards'


class Templates(models.Model):
    id_template = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'templates'


class TemplatesClients(models.Model):
    id_template = models.ForeignKey(Templates, models.DO_NOTHING, db_column='id_template')
    id_client = models.ForeignKey(Clients, models.DO_NOTHING, db_column='id_client')

    class Meta:
        managed = False
        db_table = 'templates_clients'
        unique_together = (('id_template', 'id_client'),)


class Verifications(models.Model):
    id_reponse_client = models.OneToOneField(ReponseClient, models.DO_NOTHING, db_column='id_reponse_client', primary_key=True)
    est_valide = models.BooleanField()
    id_admin = models.ForeignKey(Admin, models.DO_NOTHING, db_column='id_admin')

    class Meta:
        managed = False
        db_table = 'verifications'
