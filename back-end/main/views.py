from django.db.models import Count
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters, mixins, status, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

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
    # permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Obtener el usuario que se va a actualizar
        usuario = self.get_object()
        # Obtener los datos actualizados del usuario
        serializer = self.get_serializer(usuario, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Verificar si se cambió la contraseña
        if 'password' in request.data:
            # Cambiar la contraseña del usuario
            usuario.set_password(request.data['password'])
            usuario.save()
            # Regenerar el token de autenticación del usuario
            usuario.regenerar_token()
        return Response(serializer.data)

'''LOGIN DE USUARIOS'''


class UserLogIn(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get(user=user)
        return Response({
            'token': token.key,
            'id': user.pk,
            'username': user.username
        })


class RegistroUsuario(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer

    # parser_classes = [MultiPartParser, FormParser]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)


class Posts(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['fecha_publicacion']
    filterset_fields = ['usuario']


class Comentarios(viewsets.ModelViewSet):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']


class Likes(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']


class Amigos(viewsets.ModelViewSet):
    queryset = Amigos.objects.all()
    serializer_class = AmigosSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['usuario_solicitante','usuario_receptor']
    ordering_fields = ['fecha_creacion']


class NotificacionesAmistad(viewsets.ModelViewSet):
    queryset = NotificacionesAmistad.objects.all()
    serializer_class = NotificacionesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario_origen','usuario_destino','procesada']


class AmistadesCanceladas(viewsets.ModelViewSet):
    queryset = AmistadesCanceladas.objects.all()
    serializer_class = AmistadesCanceladasSerializer


class Chat(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
