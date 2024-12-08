from django.db import models

class Enjeux(models.Model):
    id_enjeu = models.AutoField(primary_key=True)
    nom = models.CharField(max_length = 255)
    enjeu_parent = models.ForeignKey('self',null=True, blank=True, related_name='children', on_delete=models.SET_NULL, db_column='enjeu_parent')

    class Meta:
        db_table = 'enjeux'
        managed = False

    def __str__(self):
        return self.nom

class Questions(models.Model):
    id_question = models.AutoField(primary_key=True)
    sujet = models.CharField(max_length = 255)
    statut = models.CharField(max_length = 1)
    id_enjeu = models.ForeignKey(Enjeux, null=False, blank=False, on_delete=models.DO_NOTHING, db_column='id_enjeu')
    est_ouverte = models.BooleanField()

    class Meta:
        db_table = 'questions'
        managed = False

    def __str__(self):
        return self.sujet
    
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
    adresse_mail = models.CharField(max_length=255)
    fonction = models.CharField(max_length=255)
    nom_entreprise = models.CharField(max_length=255)
    forme_juridique = models.CharField(max_length=5000)
    adresse_siege_social = models.CharField(max_length=5000)
    adresse_site_web = models.CharField(max_length=5000)
    code_nace_activité_principal = models.CharField(max_length=255)
    chiffre_affaire_du_dernier_exercice_fiscal =  models.IntegerField
    franchise = models.BooleanField
    nombre_travailleurs = models.IntegerField
    litige_respect_loi_social_environnemental = models.BooleanField
    ajouter_autre_chose = models.BooleanField
    remarque_commentaire_precision = models.CharField(max_length=5000)
    date_de_soumission = models.DateField
    id_template = models.ForeignKey(Template,null=True, on_delete=models.DO_NOTHING, db_column="id_template")
    est_valide = models.BooleanField
    mdp = models.CharField(max_length=5000)

    class Meta:
        db_table = 'clients'
        managed = False

    def __str__(self):
        return self.prenom
    
class Reponse(models.Model):
    id_reponse = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(Questions,null=False,on_delete=models.DO_NOTHING, db_column="id_question")
    texte = models.CharField(max_length=50000)
    score_individuel = models.IntegerField
    id_template = models.ForeignKey(Template,null=True, on_delete=models.DO_NOTHING, db_column="id_template")
    champ_libre = models.BooleanField
    score_engagement = models.IntegerField

    class Meta:
        db_table = 'reponses'
        managed = False

    def __str__(self):
        return self.texte
    
class Admin(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    mdp = models.CharField(max_length=255)
    role = models.CharField(max_length=255)

    class Meta : 
        db_table = 'admin'
        managed = False

    def __str__(self):
        return self.nom

class Engagement(models.Model):
    id_engagement = models.AutoField(primary_key=True)
    id_enjeu = models.ForeignKey(Enjeux, null=False, on_delete=models.DO_NOTHING, db_column="id_enjeu")
    engagement = models.CharField(max_length=50000)
    commentaire = models.CharField(max_length=50000)
    id_Admin = models.ForeignKey(Admin,null=False,on_delete=models.DO_NOTHING, db_column="id_Admin")
    KPIS = models.CharField(max_length=255)
    date = models.DateField

    class Meta : 
        db_table = 'engagements'
        managed = False

    def __str__(self): 
        return self.engagement
    
class ReponseClient(models.Model):
    id_reponse_client = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Client,null=False, on_delete=models.DO_NOTHING, db_column="id_client")
    id_reponse = models.ForeignKey(Reponse,null=False,on_delete=models.DO_NOTHING, db_column="id_reponse")
    commentaire = models.CharField(max_length=5000)
    rep_aujourdhui = models.CharField(max_length=255)
    rep_dans_2_ans = models.CharField(max_length=255)
    score_final = models.IntegerField
    sa_reponse = models.CharField(max_length=255)
    id_engagement = models.ForeignKey(Engagement,null=True,on_delete=models.DO_NOTHING, db_column="id_engagement")

    class Meta :
        db_table = 'reponse_client'
        managed = False

    def __str__(self):
        return self.commentaire