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

class Enjeux(models.Model):
    id_enjeu = models.AutoField(primary_key=True)
    nom = models.CharField(max_length = 255)
    enjeu_parent = models.ForeignKey('self',null=True, blank=True, related_name='children', on_delete=models.SET_NULL, db_column='enjeu_parent')

    class Meta:
        db_table = 'enjeux'
        managed = False

    def __str__(self):
        return self.nom
