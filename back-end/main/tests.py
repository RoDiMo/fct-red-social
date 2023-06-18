from django.db.models import Q
from django.test import TestCase

# Create your tests here.
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import get_object_or_404
from rest_framework.status import HTTP_201_CREATED
from rest_framework.test import APIClient, force_authenticate, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .BaseTestCase import BaseTest
from .models import Paises, Usuarios, Estados, Ciudades, Posts, Comentarios, Likes, Amigos, NotificacionesAmistad, \
    AmistadesCanceladas, Chat
from .serializers import PaisesSerializer, UsuarioSerializer, EstadoSerializer, CiudadesSerializer, PostSerializer, \
    ComentariosSerializer, LikesSerializer, AmigosSerializer, NotificacionesSerializer, AmistadesCanceladasSerializer, \
    ChatSerializer, RegistroSerializer


# TEST PAISES
class PaisesTest(BaseTest):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.url = reverse('paises-detail', args=[self.paises.id])

    def test_list_paises(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_pais(self):
        url = reverse('paises-list')
        request = self.client.post(url).wsgi_request
        self.paises.id = '254'
        self.paises.nombre_pais = 'Cubaa'
        serializer = PaisesSerializer(instance=self.paises, context={'request': request})
        response = self.client.post(url, data=serializer.data, format='json')
        self.assertEqual(response.status_code, HTTP_201_CREATED)

    def test_retrieve_pais(self):
        pais = Paises.objects.create(id=1, nombre_pais='Argentina')
        url = reverse('paises-detail', kwargs={'pk': pais.pk})  # Obtén la URL para recuperar un país específico
        request = self.client.post(url).wsgi_request
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_pais(self):
        pais = Paises.objects.create(id=1, nombre_pais='Argentina')
        url = reverse('paises-detail', kwargs={'pk': pais.pk})  # Obtén la URL para actualizar un país específico
        updated_data = {'id': 1, 'nombre_pais': 'Argentina actualizado'}
        response = self.client.put(url, updated_data)
        pais.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(pais.nombre_pais, updated_data['nombre_pais'])

    def test_delete_pais(self):
        pais = Paises.objects.create(id=1, nombre_pais='Argentina')
        url = reverse('paises-detail', kwargs={'pk': pais.pk})  # Obtén la URL para eliminar un país específico
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Paises.objects.filter(pk=pais.pk).exists())


# Test Estados
class EstadosTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.pais = Paises.objects.create(id=1, nombre_pais='Argentina')
        self.estado_data = {
            'id': 1,
            'id_pais': self.pais,
            'nombre_estado': 'Buenos Aires',
        }
        self.estado = Estados.objects.create(id=1, id_pais=self.pais, nombre_estado='Buenos Aires')
        self.url = reverse('estados-list')

    def test_list_estados(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_estado(self):
        url = reverse('estados-detail', kwargs={'pk': self.estado.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_estado(self):
        url = reverse('estados-detail', kwargs={'pk': self.estado.pk})
        updated_data = {
            'nombre_estado': 'Buenos Aires Updated'
        }
        response = self.client.patch(url, updated_data)
        self.estado.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(self.estado.nombre_estado, updated_data['nombre_estado'])

    def test_delete_estado(self):
        url = reverse('estados-detail', kwargs={'pk': self.estado.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Estados.objects.filter(pk=self.estado.pk).exists())


# Test Ciudades
class CiudadesTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.pais = Paises.objects.create(id=1, nombre_pais='Argentina')
        self.estado = Estados.objects.create(id=1, id_pais=self.pais, nombre_estado='Buenos Aires')
        self.ciudad_data = {
            'id': 1,
            'id_estado': self.estado,
            'nombre_ciudad': 'Ciudad Autónoma de Buenos Aires'
        }
        self.ciudad = Ciudades.objects.create(id=1, id_estado=self.estado,
                                              nombre_ciudad='Ciudad Autónoma de Buenos Aires')
        self.url = reverse('ciudades-list')

    def test_list_ciudades(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_ciudad(self):
        self.ciudad_data['id'] = 2
        self.ciudad_data['id_estado'] = 'http://localhost:8000/estados/1/'
        response = self.client.post(self.url, self.ciudad_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_ciudad(self):
        url = reverse('ciudades-detail', kwargs={'pk': self.ciudad.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_ciudad(self):
        url = reverse('ciudades-detail', kwargs={'pk': self.ciudad.pk})
        updated_data = {
            'nombre_ciudad': 'Buenos Aires Updated'
        }
        response = self.client.patch(url, updated_data)
        self.ciudad.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.ciudad.nombre_ciudad, updated_data['nombre_ciudad'])

    def test_delete_ciudad(self):
        url = reverse('ciudades-detail', kwargs={'pk': self.ciudad.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Ciudades.objects.filter(pk=self.ciudad.pk).exists())


# TEST USUARIOS
class UsuarioTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'username': 'john',
            'password': 'passEword123.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': False,
            'is_staff': False,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)
        self.url = reverse('usuarios-list')  # Asigna la URL correspondiente a la vista
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_usuario(self):
        self.usuario_data['username'] = 'nuevo_usuario'
        self.usuario_data['telefono'] = '123456789'

        response = self.client.post(self.url, self.usuario_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_usuario(self):
        url = reverse('usuarios-detail', kwargs={'pk': self.usuario.pk})
        response = self.client.get(url)
        request = self.client.post(url).wsgi_request
        serializer = UsuarioSerializer(instance=self.usuario, context={'request': request})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_update_usuario(self):
        url = reverse('usuarios-detail', kwargs={'pk': self.usuario.pk})
        updated_data = {
            'username': 'john_updated',
            'first_name': 'John Updated',
            'last_name': 'Doe Updated',
            'email': 'john.updated@example.com',
        }
        response = self.client.patch(url, updated_data)
        self.usuario.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.usuario.username, updated_data['username'])
        self.assertEqual(self.usuario.first_name, updated_data['first_name'])
        self.assertEqual(self.usuario.last_name, updated_data['last_name'])
        self.assertEqual(self.usuario.email, updated_data['email'])

    def test_delete_usuario(self):
        url = reverse('usuarios-detail', kwargs={'pk': self.usuario.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Usuarios.objects.filter(pk=self.usuario.pk).exists())

    def test_obtener_amigos(self):
        url = reverse("usuarios-obtener-amigos")
        self.client.force_authenticate(user=self.usuario)  # Autenticar el usuario en el cliente de pruebas
        response = self.client.get(url)
        self.client.force_authenticate(user=None)  # Desautenticar el usuario después de las pruebas

        amigos = Amigos.objects.filter(Q(usuario_solicitante=self.usuario) | Q(usuario_receptor=self.usuario))
        usuarios_amigos = [amigo.usuario_receptor for amigo in amigos if amigo.usuario_solicitante == self.usuario]

        serializer = UsuarioSerializer(usuarios_amigos, many=True, context={'request': response.wsgi_request})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_no_amigos(self):
        url = reverse("usuarios-no-amigos")
        self.client.force_authenticate(user=self.usuario)  # Autenticar el usuario en el cliente de pruebas
        response = self.client.get(url)
        self.client.force_authenticate(user=None)  # Desautenticar el usuario después de las pruebas

        amigos = Amigos.objects.filter(Q(usuario_solicitante=self.usuario) | Q(usuario_receptor=self.usuario))
        usuarios_amigos = [amigo.usuario_receptor for amigo in amigos if amigo.usuario_solicitante == self.usuario]

        serializer = UsuarioSerializer(usuarios_amigos, many=True, context={'request': response.wsgi_request})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


# Test UserLogin:
class UserLogInTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'id': 1,
            'username': 'admin',
            'password': 'admin',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': False,
            'is_staff': False,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)


    def test_user_login(self):
        url = "http://localhost:8000/api-user-login/"
        # self.usuario_data['id'] = 4
        # self.usuario_data['username'] = 'nuevo_usuario'
        # self.usuario_data['telefono'] = '123456789'

        response = self.client.post(url, self.usuario_data)


        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['id'], self.usuario.pk)
        self.assertEqual(response.data['username'], self.usuario.username)



# Test  RegistroUsuario

class RegistroUsuarioTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'username': 'Manolin',
            'password': 'OrnsteinTrumpet1.',
            'telefono': '675154209',
            'email': 'test@example.com'
        }

    def test_registro_usuario(self):
        url = "http://localhost:8000/registro/"
        response = self.client.post(url, self.usuario_data)

        print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


# Test Post
class PostTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.usuario_data = {
            "id": 6,
            "username": "floppy",
            "password": "OrnsteinTurmpet1.",
            "first_name": "Floppy",
            "last_name": "Bicho",
            "email": "floppy@gmail.com",
            "telefono": "658130586",
            "es_moderador": False,
            "is_staff": False,
            "pais": "España",
            "estado": "Sevilla",
            "ciudad": "Sevilla Este",
            "direccion": "Calle doctor hermosilla molina 4",
            "foto_perfil": "",
            "fecha_alta": "2023-05-17T11:39:19.571636+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)
        self.post_data = {
            'usuario': 'http://localhost:8000/usuarios/6/',
            'titulo': 'Título del post',
            'contenido': 'Contenido del post',
            'num_likes': 0,
            'num_visitas': 0,
            'num_comentarios': 0,
            'oculto': False
        }
        self.post = Posts.objects.create(usuario=self.usuario, titulo='Título del post', contenido='Contenido del post')
        self.url = reverse('posts-list')
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_list_posts(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post(self):
        response = self.client.post(self.url, self.post_data)
        self.post_data['usuario'] = "http://localhost:8000/usuarios/6/"
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_post(self):
        url = reverse('posts-detail', kwargs={'pk': self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_post(self):
        url = reverse('posts-detail', kwargs={'pk': self.post.pk})
        updated_data = {
            'titulo': 'Título actualizado'
        }
        response = self.client.patch(url, updated_data)
        self.post.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post.titulo, updated_data['titulo'])

    def test_delete_post(self):
        url = reverse('posts-detail', kwargs={'pk': self.post.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Posts.objects.filter(pk=self.post.pk).exists())

    def test_obtener_post(self):
        url = reverse("posts-obtener-post")
        self.client.force_authenticate(user=self.usuario)  # Autenticar el usuario en el cliente de pruebas
        response = self.client.get(url, {'user': self.usuario.id})
        self.client.force_authenticate(user=None)  # Desautenticar el usuario después de las pruebas

        amigos = Amigos.objects.filter(usuario_solicitante=self.usuario)
        queryset_amigos = Posts.objects.filter(usuario__in=amigos.values('usuario_receptor')).order_by(
            '-fecha_publicacion')
        queryset_no_amigos = Posts.objects.exclude(
            Q(usuario__in=amigos.values('usuario_receptor')) | Q(usuario=self.usuario)).order_by('-fecha_publicacion')
        queryset = list(queryset_amigos) + list(queryset_no_amigos)

        queryset.sort(key=lambda post: (
        0 if post.usuario in amigos.values('usuario_receptor') else 1, post.fecha_publicacion.date()), reverse=True)

        serializer = PostSerializer(queryset, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


# Test Comentarios
class ComentariosTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.usuario_data = {
            "id": 1,
            "username": "admin",
            "password": "admin",
            "first_name": "Roberto Eduardo",
            "last_name": "Diaz Morffi",
            "email": "admin@gmail.com",
            "telefono": "6581305822",
            "es_moderador": False,
            "is_staff": False,
            "pais": "España",
            "estado": "Sevilla",
            "ciudad": "Bollullos de la Mitación",
            "direccion": "Calle doctor hermosilla molina 4",
            "foto_perfil": "",
            "fecha_alta": "2023-05-17T10:57:04.156006+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)
        self.post_data = {
            'id': 1,
            'usuario': 'http://localhost:8000/usuarios/1/',
            'titulo': 'Título del post',
            'contenido': 'Contenido del post',
            'num_likes': 0,
            'num_visitas': 0,
            'num_comentarios': 0,
            'oculto': False
        }
        self.post = Posts.objects.create(usuario=self.usuario, titulo='Título del post', contenido='Contenido del post')
        self.comentario_data = {
            "id": 2,
            "post": "http://localhost:8000/posts/1/",
            "usuario": "http://localhost:8000/usuarios/1/",
            "contenido": "c1",
            "fecha_creacion": "2023-05-17T11:10:21.642892+02:00"
        }
        self.comentario = Comentarios.objects.create(post=self.post, usuario=self.usuario,
                                                     contenido='Contenido del comentario')
        self.url = reverse('comentarios-list')
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_list_comentarios(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_comentario(self):
        response = self.client.post(self.url, self.comentario_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_comentario(self):
        url = reverse('comentarios-detail', kwargs={'pk': self.comentario.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_comentario(self):
        url = reverse('comentarios-detail', kwargs={'pk': self.comentario.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comentarios.objects.filter(pk=self.comentario.pk).exists())


class LikesTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.usuario_data = {
            "id": 1,
            "username": "admin",
            "password": "admin",
            "first_name": "Roberto Eduardo",
            "last_name": "Diaz Morffi",
            "email": "admin@gmail.com",
            "telefono": "6581305822",
            "es_moderador": False,
            "is_staff": False,
            "pais": "España",
            "estado": "Sevilla",
            "ciudad": "Bollullos de la Mitación",
            "direccion": "Calle doctor hermosilla molina 4",
            "foto_perfil": "",
            "fecha_alta": "2023-05-17T10:57:04.156006+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)
        self.post_data = {
            "url": "http://localhost:8000/posts/2/",
            "usuario": "http://localhost:8000/usuarios/1/",
            "titulo": "Post de Admin 1",
            "contenido": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nisi justo, sodales vitae ante id, posuere interdum arcu. Praesent tempor velit vel interdum molestie. Proin vel tortor pharetra dui hendrerit ultrices a finibus magna. In at malesuada dolor. Vivamus gravida gravida magna, et viverra neque pellentesque vel. Nulla volutpat maximus rhoncus. In venenatis, ante sed viverra lobortis, ex lorem semper quam, ut tempus ipsum dui id nisl. In posuere lacus leo, ullamcorper vulputate orci porta vel. Nulla posuere in nibh a  ultrices. Curabitur sed nunc sit amet augue vestibulum faucibus. Praesent id rutrum justo, vel fermentum leo. Nunc nunc risus, mollis a neque at, rutrum viverra risus. Mauris a facilisis risus. Pellentesque pretium tincidunt dui, at volutpat turpis. Nam bibendum libero ut diam tempus, in commodo sem fermentum. Curabitur in leo vel lorem tristique fermentum.\r\n\r\nPraesent eu semper lorem, at dapibus libero. Aenean aliquam luctus pharetra. Cras magna purus, dapibus sit dolor",
            "imagen": "http://localhost:8000/media/main/imagenes/posts/Post2_eeU3M7a.jpg",
            "fecha_publicacion": "2023-05-17T11:01:13.527904+02:00",
            "num_likes": 3,
            "num_visitas": 11,
            "num_comentarios": 1,
            "oculto": False,
            "datos_usuario": {
                "url": "http://localhost:8000/usuarios/1/",
                "id": 1,
                "username": "admin",
                "password": "pbkdf2_sha256$390000$LyiotT0xg3Czc49p6IFOG5$JjsBr7lI9oYko2OwbkPZf+688l6t72RMmcefUVt+VeI=",
                "first_name": "Roberto Eduardo",
                "last_name": "Diaz Morffi",
                "email": "admin@gmail.com",
                "telefono": "6581305822",
                "es_moderador": False,
                "is_staff": True,
                "pais": "España",
                "estado": "Sevilla",
                "ciudad": "Bollullos de la Mitación",
                "direccion": "Calle doctor hermosilla molina 4",
                "foto_perfil": "http://localhost:8000/media/main/imagenes/usuarios/Captura_k50AQFp.PNG",
                "fecha_alta": "2023-05-17T10:57:04.156006+02:00"
            }
        }
        self.post = Posts.objects.create(usuario=self.usuario, titulo='Título del post', contenido='Contenido del post')
        self.like_data = {
            "url": "http://localhost:8000/likes/101/",
            "usuario": "http://localhost:8000/usuarios/1/",
            "post": self.post_data['url']

        }
        self.like = Likes.objects.create(post=self.post, usuario=self.usuario)
        self.url = reverse('likes-list')
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_likes(self):
        # Realiza una solicitud GET a la vista de Likes
        response = self.client.get('/likes/')

        # Verifica que la respuesta sea exitosa (código de estado 200)
        self.assertEqual(response.status_code, 200)

    def test_retrieve_like(self):
        # Realiza una solicitud GET para obtener un like específico
        response = self.client.get(f'/likes/{self.like.id}/')

        # Verifica que la respuesta sea exitosa (código de estado 200)
        self.assertEqual(response.status_code, 200)

    def test_update_like(self):
        url = reverse('likes-detail', kwargs={'pk': self.like.pk})
        updated_data = {
            "usuario": "http://localhost:8000/usuarios/1/",
        }

        response = self.client.patch(url, updated_data)

        self.like.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_like(self):
        # Realiza una solicitud DELETE para eliminar un like específico
        response = self.client.delete(f'/likes/{self.like.id}/')

        # Verifica que la respuesta sea exitosa (código de estado 204 para la eliminación exitosa)
        self.assertEqual(response.status_code, 204)

        # Verifica que el like haya sido eliminado de la base de datos
        self.assertFalse(Likes.objects.filter(id=self.like.id).exists())


# Test Amigos

class AmigosModelTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'id': 1,
            'username': 'john',
            'password': 'passEword123.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)

        self.usuario_data1 = {
            'id': 2,
            'username': 'johne',
            'password': 'passEword123e.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '123456e890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario1 = Usuarios.objects.create_user(**self.usuario_data1)

        self.amigo = Amigos.objects.create(
            usuario_solicitante=self.usuario,
            usuario_receptor=self.usuario1,
            fecha_creacion=timezone.now()
        )
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_amigos_creation(self):
        self.assertIsInstance(self.amigo, Amigos)
        self.assertEqual(self.amigo.usuario_solicitante, self.usuario)
        self.assertEqual(self.amigo.usuario_receptor, self.usuario1)
        self.assertEqual(self.amigo.fecha_creacion.date(), timezone.now().date())

    def test_get_single_amigo(self):
        response = self.client.get(reverse("amigos-detail", args=[self.amigo.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_amigo(self):
        updated_data = {
            "usuario_solicitante": 'http://testserver/usuarios/1/',
            "usuario_receptor": 'http://testserver/usuarios/2/',
            "fecha_creacion": "2023-06-19T12:00:00Z"
        }
        response = self.client.put(reverse("amigos-detail", args=[self.amigo.pk]), updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["usuario_solicitante"], updated_data["usuario_solicitante"])
        self.assertEqual(response.data["usuario_receptor"], updated_data["usuario_receptor"])

    def test_delete_amigo(self):
        response = self.client.delete(reverse("amigos-detail", args=[self.amigo.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Amigos.objects.filter(pk=self.amigo.pk).exists())


# NotificacionesAmistad

class NotificacionesAmistadTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'id': 1,
            'username': 'john',
            'password': 'passEword123.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)

        self.usuario_data1 = {
            'id': 2,
            'username': 'johne',
            'password': 'passEword123e.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '123456e890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario1 = Usuarios.objects.create_user(**self.usuario_data1)
        self.notificacion = NotificacionesAmistad.objects.create(
            usuario_origen=self.usuario,
            usuario_destino=self.usuario1,
            estado="Pendiente",
            fecha_notificacion=timezone.now(),
            procesada=False
        )

        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_all_notificaciones(self):
        response = self.client.get(reverse("notificacionesamistad-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_notificacion(self):
        response = self.client.get(reverse("notificacionesamistad-detail", args=[self.notificacion.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_notificacion(self):
        data = {
            "usuario_origen": 'http://testserver/usuarios/1/',
            "usuario_destino": 'http://testserver/usuarios/2/',
            "estado": "Pendiente",
            "fecha_notificacion": "2023-06-18T12:00:00Z",
            "procesada": False
        }

        response = self.client.post(reverse("notificacionesamistad-list"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_notificacion(self):
        updated_data = {
            "usuario_origen": 'http://testserver/usuarios/1/',
            "usuario_destino": 'http://testserver/usuarios/2/',
            "estado": "Aceptada",
            "fecha_notificacion": "2023-06-19T12:00:00Z",
            "procesada": True
        }
        response = self.client.put(reverse("notificacionesamistad-detail", args=[self.notificacion.pk]), updated_data,
                                   format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["estado"], updated_data["estado"])
        self.assertNotEqual(response.data["fecha_notificacion"], updated_data["fecha_notificacion"])
        self.assertEqual(response.data["procesada"], updated_data["procesada"])

    def test_delete_notificacion(self):
        response = self.client.delete(reverse("notificacionesamistad-detail", args=[self.notificacion.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(NotificacionesAmistad.objects.filter(pk=self.notificacion.pk).exists())


# AmistadesCanceladas
class AmistadesCanceladasTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'id': 1,
            'username': 'john',
            'password': 'passEword123.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)

        self.usuario_data1 = {
            'id': 2,
            'username': 'johne',
            'password': 'passEword123e.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '123456e890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario1 = Usuarios.objects.create_user(**self.usuario_data1)
        self.amistad_cancelada = AmistadesCanceladas.objects.create(
            amigo_emisor=self.usuario,
            amigo_receptor=self.usuario1,
            fecha_inicio=timezone.now(),
            fecha_fin=timezone.now()
        )

        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_all_amistades_canceladas(self):
        response = self.client.get(reverse("amistadescanceladas-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_amistad_cancelada(self):
        response = self.client.get(reverse("amistadescanceladas-detail", args=[self.amistad_cancelada.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_amistad_cancelada(self):
        data = {
            "amigo_emisor": 'http://testserver/usuarios/1/',
            "amigo_receptor": 'http://testserver/usuarios/2/',
            "fecha_inicio": "2023-06-18T12:00:00Z",
            "fecha_fin": "2023-06-19T12:00:00Z"
        }

        response = self.client.post(reverse("amistadescanceladas-list"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_amistad_cancelada(self):
        updated_data = {
            "amigo_emisor": 'http://testserver/usuarios/1/',
            "amigo_receptor": 'http://testserver/usuarios/2/',
            "fecha_inicio": "2023-06-20T12:00:00Z",
            "fecha_fin": "2023-06-21T12:00:00Z"
        }
        response = self.client.put(reverse("amistadescanceladas-detail", args=[self.amistad_cancelada.pk]),
                                   updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data["fecha_inicio"], updated_data["fecha_inicio"])
        self.assertNotEqual(response.data["fecha_fin"], updated_data["fecha_fin"])

    def test_delete_amistad_cancelada(self):
        response = self.client.delete(reverse("amistadescanceladas-detail", args=[self.amistad_cancelada.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(AmistadesCanceladas.objects.filter(pk=self.amistad_cancelada.pk).exists())


# Test Chat


class ChatsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.usuario_data = {
            'id': 1,
            'username': 'john',
            'password': 'passEword123.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '1234567890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario = Usuarios.objects.create_user(**self.usuario_data)

        self.usuario_data1 = {
            'id': 2,
            'username': 'johne',
            'password': 'passEword123e.',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'telefono': '123456e890',
            'es_moderador': True,
            'is_staff': True,
            'pais': 'Argentina',
            'estado': 'Buenos Aires',
            'ciudad': 'Ciudad Autónoma de Buenos Aires',
            'direccion': '123 Calle Principal',
            'foto_perfil': '',
            'fecha_alta': "2023-05-17T11:37:46.578181+02:00"
        }
        self.usuario1 = Usuarios.objects.create_user(**self.usuario_data1)
        self.chat = Chat.objects.create(
            emisor=self.usuario,
            receptor=self.usuario1,
            fecha_mensaje=timezone.now(),
            leido=False,
            mensaje="Mensaje de prueba"
        )
        self.token = get_object_or_404(Token, user=self.usuario)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_all_chats(self):
        response = self.client.get(reverse("chat-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_chat(self):
        response = self.client.get(reverse("chat-detail", args=[self.chat.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_chat(self):
        data = {
            "emisor": 'http://testserver/usuarios/1/',
            "receptor": 'http://testserver/usuarios/2/',
            "fecha_mensaje": "2023-06-18T12:00:00Z",
            "leido": False,
            "mensaje": "Nuevo mensaje"
        }

        response = self.client.post(reverse("chat-list"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_chat(self):
        updated_data = {
            "emisor": 'http://testserver/usuarios/1/',
            "receptor": 'http://testserver/usuarios/2/',
            "fecha_mensaje": "2023-06-19T12:00:00Z",
            "leido": True,
            "mensaje": "Mensaje actualizado"
        }
        response = self.client.put(reverse("chat-detail", args=[self.chat.pk]), updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data["fecha_mensaje"], updated_data["fecha_mensaje"])
        self.assertEqual(response.data["leido"], updated_data["leido"])
        self.assertEqual(response.data["mensaje"], updated_data["mensaje"])

    def test_delete_chat(self):
        response = self.client.delete(reverse("chat-detail", args=[self.chat.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Chat.objects.filter(pk=self.chat.pk).exists())

    def test_mensajes_chat(self):
        url = reverse("chat-mensajes-chat")
        response = self.client.get(url, {'emisor': 1, 'receptor': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mensajes_no_leidos(self):
        url = reverse("chat-mensajes-no-leidos")
        response = self.client.get(url, {'emisor': 1, 'receptor': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
