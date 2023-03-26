from django.db import models

# Create your models here.


class Paises(models.Model):
    id = models.IntegerField(primary_key=True, null=False)
    nombre_pais = models.CharField(max_length=50)

    def __str__(self):
        return "Pais: {}".format(self.nombre_pais)


class Estados(models.Model):
    id = models.IntegerField(primary_key=True, null=False)
    id_pais = models.ForeignKey(Paises, on_delete=models.RESTRICT)
    nombre_estado = models.CharField(max_length=50)

    def __str__(self):
        return "Estado: {}".format(self.nombre_estado)


class Ciudades(models.Model):
    id = models.BigIntegerField(primary_key=True, null=False)
    id_estado = models.ForeignKey(Estados, on_delete=models.RESTRICT)
    nombre_ciudad = models.CharField(max_length=250)

    def __str__(self):
        return "Ciudad: {}".format(self.nombre_ciudad)