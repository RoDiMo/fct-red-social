from django.db.models import Count
from django.shortcuts import render

from rest_framework import viewsets, permissions, filters, mixins, status

from main.models import *
from main.serializers import *


# Create your views here.


class Paises(viewsets.ModelViewSet):
    queryset = Paises.objects.all()
    serializer_class = PaisesSerializer


class Estados(viewsets.ModelViewSet):
    queryset = Estados.objects.all()
    serializer_class = EstadoSerializer


class Ciudades(viewsets.ModelViewSet):
    queryset = Ciudades.objects.all()
    serializer_class = CiudadesSerializer


class Usuarios(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer


class Posts(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer


class Comentarios(viewsets.ModelViewSet):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer


class Likes(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer


class Amigos(viewsets.ModelViewSet):
    queryset = Amigos.objects.all()
    serializer_class = AmigosSerializer


class NotificacionesAmistad(viewsets.ModelViewSet):
    queryset = NotificacionesAmistad.objects.all()
    serializer_class = NotificacionesSerializer
