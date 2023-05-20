import string
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
                  'es_moderador',
                  'is_staff',
                  'pais',
                  'estado',
                  'ciudad',
                  'direccion',
                  'foto_perfil',
                  'fecha_alta',
                  )


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ('id',
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
                  'foto_perfil',

                  )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return Usuarios.objects.create_user(**validated_data)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra mayúscula.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos una letra minúscula.")
        if not any(char in string.punctuation for char in value):
            raise serializers.ValidationError("La contraseña debe contener al menos un signo de puntuación.")
        return value


class PostSerializer(serializers.HyperlinkedModelSerializer):
    datos_usuario = UsuarioSerializer(source='usuario', read_only=True)
    class Meta:
        model = Posts
        fields = ('url',
                  'id',
                  'usuario',
                  'titulo',
                  'contenido',
                  'imagen',
                  'fecha_publicacion',
                  'num_likes',
                  'num_visitas',
                  'num_comentarios',
                  'oculto',
                  'datos_usuario'
                  )

class ComentariosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comentarios
        fields = ('url', 'id', 'post', 'usuario', 'contenido', 'fecha_creacion')


class LikesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Likes
        fields = ('url', 'usuario', 'post')


class AmigosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Amigos
        fields = ('url', 'usuario_solicitante', 'usuario_receptor', 'fecha_creacion')


class NotificacionesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificacionesAmistad
        fields = ('url', 'id', 'usuario_origen', 'usuario_destino', 'estado', 'fecha_notificacion', 'procesada')


class AmistadesCanceladasSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AmistadesCanceladas
        fields = ('url', 'id', 'amigo_emisor', 'amigo_receptor', 'fecha_inicio', 'fecha_fin')


class ChatSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Chat
        fields = ('url', 'id', 'emisor', 'receptor', 'fecha_mensaje', 'leido', 'mensaje')

