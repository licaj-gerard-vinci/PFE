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