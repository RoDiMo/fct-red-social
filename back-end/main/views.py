from django.db.models import Count
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters, mixins, status, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from main import filtros
from main.permissions import *
from main.serializers import *
from main.filtros import *


# Create your views here.


class Paises(viewsets.ModelViewSet):
    queryset = Paises.objects.all()
    serializer_class = PaisesSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id']


class Estados(viewsets.ModelViewSet):
    queryset = Estados.objects.all()
    serializer_class = EstadoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_pais__nombre_pais']
    permission_classes = [AllowAny]


class Ciudades(viewsets.ModelViewSet):
    queryset = Ciudades.objects.all()
    serializer_class = CiudadesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_estado__nombre_estado']
    permission_classes = [AllowAny]


class Usuario(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter,
                       filtros.FechaAltaFilterBackend]
    ordering_fields = ['username', 'first_name', 'last_name', 'email', 'pais', 'ciudad', 'direccion', 'estado',
                       'es_moderador', 'fecha_alta']
    filterset_fields = ['id', 'username', 'es_moderador']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'pais', 'estado']

    @action(detail=False, methods=['get'])
    def obtener_amigos(self, request):
        usuario_actual = request.user
        # Obtenemos las amistades del usuario
        amigos = Amigos.objects.filter(Q(usuario_solicitante=usuario_actual) | Q(usuario_receptor=usuario_actual))
        usuarios_amigos = []

        # Recorremos el listado de amistades y añadimos los datos de usuario de los amigos
        for amigo in amigos:
            if amigo.usuario_solicitante == usuario_actual:
                usuarios_amigos.append(amigo.usuario_receptor)

        serializer = UsuarioSerializer(usuarios_amigos, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def no_amigos(self, request):
        usuario_actual = request.user
        query = request.query_params.get('query', '')  # Obtener el término de búsqueda del parámetro 'query'

        # Obtenemos las amistades del usuario
        amigos = Amigos.objects.filter(Q(usuario_solicitante=usuario_actual) | Q(usuario_receptor=usuario_actual))

        # Si no encuentra amigos solo excluimos de la lista al propio usuario
        if not amigos:
            usuarios_no_amigos = Usuarios.objects.exclude(id=usuario_actual.id)
        # Si encuentra amigos, guardaremos los datos de los usuarios amigos
        else:
            usuarios_amigos = [amigo.usuario_solicitante for amigo in amigos] + [amigo.usuario_receptor for amigo in
                                                                                 amigos]
            # Guardamos los datos que no se encuentren en usuarios_amigos
            usuarios_no_amigos = Usuarios.objects.exclude(id__in=[usuario.id for usuario in usuarios_amigos])
        # Aplicar filtro por término de búsqueda si se proporciona
        if query:
            usuarios_no_amigos = usuarios_no_amigos.filter(
                Q(username__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query))

        # Nos quedamos solo con loas tres primeras coincidencias
        usuarios_no_amigos = usuarios_no_amigos[:3]

        # Serializamos y devolevemos los datos de los usuarios amigos
        serializer = UsuarioSerializer(usuarios_no_amigos, many=True, context={'request': request})

        return Response(serializer.data)

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


class Post(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter,
                       filtros.FechaPublicacionFilterBackend]
    ordering_fields = ['titulo', 'usuario__username', 'num_visitas', 'num_likes', 'num_comentarios', 'oculto',
                       'fecha_publicacion']
    filterset_fields = ['usuario', 'oculto']
    search_fields = ['titulo', 'usuario__username']

    # Obtenemos todos los post, salvo los nuestros y los ordenamos por dia, dando prioridad a los post de nuestros
    # amigos
    @action(detail=False, methods=['get'])
    def obtener_post(self, request):
        user = request.query_params.get('user')

        # Obtenemos los usuarios amigos
        amigos = Amigos.objects.filter(
            Q(usuario_solicitante=user)
        )
        # Obtenemos los post de los amigos del usuario ordenados por fecha
        queryset_amigos = self.filter_queryset(
            self.get_queryset().filter(usuario__in=amigos.values('usuario_receptor')).order_by('-fecha_publicacion'))

        # Obtenemos los post de los no amigos del usuario ordenados por fecha
        queryset_no_amigos = self.filter_queryset(
            self.get_queryset().exclude(
                Q(usuario__in=amigos.values('usuario_receptor')) | Q(usuario=user)
            ).order_by('-fecha_publicacion')
        )

        # Obtenemos todos los post, danto prioridad a los post de los amigos
        queryset = list(queryset_amigos) + list(queryset_no_amigos)

        # Se ordenan los post de forma descendente poniendo primero a los de los amigos del usuario
        # y luego los ordena por fecha
        queryset.sort(key=lambda post: (
            0 if post.usuario in amigos.values('usuario_receptor') else 1,  # Amigos primero
            post.fecha_publicacion.date()  # Ordenar por día
        ), reverse=True)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class Comentarios(viewsets.ModelViewSet):
    queryset = Comentarios.objects.all()
    serializer_class = ComentariosSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']

    def get_permissions(self):
        return permisos_modelos(self.action)


class Likes(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']


class Amigo(viewsets.ModelViewSet):
    queryset = Amigos.objects.all()
    serializer_class = AmigosSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['usuario_solicitante', 'usuario_receptor']
    ordering_fields = ['fecha_creacion']


class NotificacionesAmistad(viewsets.ModelViewSet):
    queryset = NotificacionesAmistad.objects.all()
    serializer_class = NotificacionesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['usuario_origen', 'usuario_destino', 'procesada']


class AmistadesCanceladas(viewsets.ModelViewSet):
    queryset = AmistadesCanceladas.objects.all()
    serializer_class = AmistadesCanceladasSerializer


class Chats(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['emisor', 'receptor', 'leido']

    @action(detail=False, methods=['get'])
    def mensajes_chat(self, request):
        emisor = request.query_params.get('emisor')  # Usuario emisor
        receptor = request.query_params.get('receptor')  # Usuario receptor

        # Obtenemos los mensajes del chat del usuario emisor y receptor ordenados por fecha
        mensajes = Chat.objects.all().filter(
            (Q(emisor=emisor) & Q(receptor=receptor)) |
            (Q(emisor=receptor) & Q(receptor=emisor))
        ).order_by('fecha_mensaje')

        serializers_context = self.get_serializer_context()
        serializer = ChatSerializer(instance=mensajes.distinct(), context=serializers_context, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def mensajes_no_leidos(self, request):
        emisor = request.query_params.get('emisor')  # Usuario emisor
        receptor = request.query_params.get('receptor')  # Usuario receptor

        # Obtenemos los mensajes del chat del usuario emisor y receptor ordenados por fecha
        mensajes = Chat.objects.filter(
            (Q(emisor=emisor) & Q(receptor=receptor)) |
            (Q(emisor=receptor) & Q(receptor=emisor))
        ).order_by('fecha_mensaje')

        # Nos quedamos solo con los mensajes que no han sido leidos
        mensajes_no_leidos = mensajes.filter(leido=False, receptor=emisor)

        serializers_context = self.get_serializer_context()
        serializer = ChatSerializer(instance=mensajes_no_leidos, context=serializers_context, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
