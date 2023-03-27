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
                  'first_name',
                  'last_name', 'email',
                  'telefono',
                  'administrador',
                  'pais',
                  'estado',
                  'ciudad',
                  'direccion',
                  'foto_perfil')
        read_only_fields = ('username',)


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Posts
        fields = ('usuario',
                  'titulo',
                  'contenido',
                  'imagen',
                  'fecha_publicacion',
                  'num_likes',
                  'num_visitas')


class ComentariosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comentarios
        fields = ('post', 'usuario', 'contenido', 'fecha_creacion')


class LikesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Likes
        fields = ('usuario', 'post')


class AmigosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amigos
        fields = ('usuario_solicitante', 'usuario_receptor')


class NotificacionesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificacionesAmistad
        fields = ('usuario_origen', 'usuario_destino', 'contenido', 'fecha_notificacion', 'procesada')
