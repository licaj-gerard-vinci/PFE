from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'


class Admin(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    mdp = models.CharField(max_length=255)
    role = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        db_table = 'admin'  # Le nom de la table dans le schéma personnalisé
        managed = False  # Indique à Django de ne pas gérer la table

    def __str__(self):
        return f"{self.nom} {self.prenom}"

class Client(models.Model):
    id_client = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    fonction = models.CharField(max_length=255)
    nom_entreprise = models.CharField(max_length=255)
    forme_juridique = models.CharField(max_length=255)
    adresse_siege_social = models.CharField(max_length=255)
    adresse_site_web = models.CharField(max_length=255)
    code_nace_activite_principal = models.CharField(max_length=255)
    chiffre_affaire_du_dernier_exercice_fiscal = models.IntegerField()
    franchise = models.BooleanField()
    nombre_travailleurs = models.IntegerField()
    litige_respect_loi_social_environnemental = models.BooleanField()
    honnete = models.BooleanField()
    soumission_demande_de_subside_pour_le_label = models.BooleanField()
    ajouter_autre_chose = models.BooleanField()
    remarque_commentaire_precision = models.CharField(max_length=255, null=True, blank=True)
    date_de_soumission = models.DateField()
    est_valide = models.BooleanField()
    mdp = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        db_table = 'clients'  # Le nom de la table dans le schéma personnalisé
        managed = False  # Indique à Django de ne pas gérer la table

    def __str__(self):
        return f"{self.nom} {self.prenom}"
