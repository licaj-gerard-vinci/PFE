from django.db import models

class Template(models.Model):
    id_template = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)

    class Meta:
        db_table = 'templates'
        managed = False

    def str(self):
        return self.nom

class Client(models.Model):
    id_client = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
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
    litige_respect_loi_social_environnemental = models.BooleanField()
    honnete = models.BooleanField()
    soumission_demande_de_subside_pour_le_label = models.BooleanField()
    partenaire_introduction = models.CharField(max_length=255)
    ajouter_autre_chose = models.BooleanField()
    remarque_commentaire_precision = models.CharField(max_length=5000, null=True)
    date_de_soumission = models.DateField()
    est_valide = models.CharField(max_length=255)
    mdp = models.CharField(max_length=5000, null=True)

    class Meta:
        db_table = 'clients'
        managed = False

    def str(self):
        return self.nom_entreprise

class QuestionsOnboarding(models.Model):
    id_questions_onboarding = models.AutoField(primary_key=True)
    question = models.CharField(max_length=5000)

    class Meta:
        db_table = 'questions_onboarding'
        managed = False

    def str(self):
        return self.question