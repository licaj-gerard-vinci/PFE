from django.db import models

class Template(models.Model):
    id_template = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)

    class Meta:
        db_table = 'templates'
        managed = False

    def __str__(self):
        return self.nom

class Client(models.Model):
    id_client = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    adresse_mail = models.EmailField(unique=True)
    fonction = models.CharField(max_length=255)
    nom_entreprise = models.CharField(max_length=255)
    forme_juridique = models.CharField(max_length=5000)
    adresse_siège_social = models.CharField(max_length=5000)
    adresse_site_web = models.CharField(max_length=5000)
    code_nace_activité_principal = models.CharField(max_length=255)
    chiffre_affaire_du_dernier_exercice_fiscal = models.IntegerField()
    franchise = models.BooleanField()
    nombre_travailleurs = models.IntegerField()
    litige_respect_loi_social_environnemental = models.BooleanField()
    honnete = models.BooleanField()
    soumission_demande_de_subside_pour_le_label = models.BooleanField()
    ajouter_autre_chose = models.BooleanField()
    remarque_commentaire_precision = models.CharField(max_length=5000, null=True)
    date_de_soumission = models.DateField()
    id_template = models.ForeignKey(Template, on_delete=models.SET_NULL, null=True, db_column='id_template')
    est_valide = models.BooleanField()
    mdp = models.CharField(max_length=5000, null=True)

    class Meta:
        db_table = 'clients'
        managed = False

    def __str__(self):
        return self.nom_entreprise