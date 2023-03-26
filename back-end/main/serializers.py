from pyexpat import model

from django.db.models import Avg
from rest_framework import serializers

from main.models import *


class PaisesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Paises
        fields = ['url', 'id', 'nombre_pais']


class EstadoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Estados
        fields = ['url', 'id', 'id_pais','nombre_estado']


class CiudadesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ciudades
        fields = ['url', 'id','id_estado' ,'nombre_ciudad']
