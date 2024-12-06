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
