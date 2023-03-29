from pyexpat import model

from django.db.models import Avg, Count
from rest_framework import serializers

from main.models import *


class PaisesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Paises
        fields = ['url', 'id', 'nombre_pais']


class EstadoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Estados
        fields = ['url', 'id', 'id_pais', 'nombre_estado']


class CiudadesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ciudades
        fields = ['url', 'id', 'id_estado', 'nombre_ciudad']


class UsuarioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Usuarios

        fields = ('url',
                  'id',
                  'username',
                  'password',
                  'first_name',
                  'last_name',
                  'email',
                  'telefono',
                  'is_staff',
                  'pais',
                  'estado',
                  'ciudad',
                  'direccion',
                  'foto_perfil')


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Posts
        fields = ('url',
                  'usuario',
                  'titulo',
                  'contenido',
                  'imagen',
                  'fecha_publicacion',
                  'num_likes',
                  'num_visitas')


class ComentariosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comentarios
        fields = ('url', 'post', 'usuario', 'contenido', 'fecha_creacion')


class LikesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Likes
        fields = ('url', 'usuario', 'post')


class AmigosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amigos
        fields = ('url', 'usuario_solicitante', 'usuario_receptor')


class NotificacionesSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = NotificacionesAmistad
        fields = ('url', 'id', 'usuario_origen', 'usuario_destino', 'contenido', 'fecha_notificacion', 'procesada')


