from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q, F
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from rest_framework.authtoken.models import Token


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
    paginate_by = 10

    def __str__(self):
        return "Ciudad: {}".format(self.nombre_ciudad)


class Usuarios(AbstractUser):
    telefono = models.CharField(max_length=50, unique=True, null=False)
    pais = models.CharField(max_length=250, default='')
    estado = models.CharField(max_length=250, default='')
    ciudad = models.CharField(max_length=250, default='')
    direccion = models.CharField(max_length=250, default='')
    foto_perfil = models.ImageField(upload_to='main/imagenes/usuarios', null=True)
    fecha_alta = models.DateTimeField(default=timezone.now)
    es_moderador = models.BooleanField(default=False)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)

    def regenerar_token(self):
        Token.objects.filter(user=self).delete()
        Token.objects.create(user=self)


class Posts(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.RESTRICT)
    titulo = models.CharField(max_length=125)
    contenido = models.CharField(max_length=1024)
    imagen = models.ImageField(upload_to='main/imagenes/posts', null=True)
    fecha_publicacion = models.DateTimeField(default=timezone.now)
    num_likes = models.PositiveBigIntegerField(default=0)
    num_visitas = models.BigIntegerField(default=0)
    num_comentarios = models.BigIntegerField(default=0)
    oculto = models.BooleanField(default=False)

    def __str__(self):
        return "Titulo: {}".format(self.titulo)


class Comentarios(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    contenido = models.CharField(max_length=1024)
    fecha_creacion = models.DateTimeField(default=timezone.now)


class Likes(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['usuario', 'post'], name='likes'
            )
        ]


class Amigos(models.Model):
    usuario_solicitante = models.ForeignKey(Usuarios, related_name="usuario_solicitante", on_delete=models.RESTRICT)
    usuario_receptor = models.ForeignKey(Usuarios, related_name="usuario_receptor", on_delete=models.RESTRICT)
    fecha_creacion = models.DateTimeField(default=timezone.now)

    class Meta:
        constraints = [
            models.CheckConstraint(check=~Q(usuario_solicitante=F('usuario_receptor')), name='could_not_block_itself'),

            models.UniqueConstraint(
                fields=['usuario_solicitante', 'usuario_receptor'], name='amigos'
            )
        ]

class NotificacionesAmistad(models.Model):
    usuario_origen = models.ForeignKey(Usuarios, related_name="usuario_origen", on_delete=models.RESTRICT)
    usuario_destino = models.ForeignKey(Usuarios, related_name="usuario_destino", on_delete=models.RESTRICT)
    estado = models.CharField(max_length=10)
    fecha_notificacion = models.DateTimeField(default=timezone.now)
    procesada = models.BooleanField(default=False)


class AmistadesCanceladas(models.Model):
    amigo_emisor = models.ForeignKey(Usuarios, related_name="amigo_emisor", on_delete=models.RESTRICT)
    amigo_receptor = models.ForeignKey(Usuarios, related_name="amigo_receptor", on_delete=models.RESTRICT)
    fecha_inicio = models.DateTimeField(default=timezone.now)
    fecha_fin = models.DateTimeField(default=timezone.now)


class Chat(models.Model):
    emisor = models.ForeignKey(Usuarios, related_name="emisor", on_delete=models.RESTRICT)
    receptor = models.ForeignKey(Usuarios, related_name="receptor", on_delete=models.RESTRICT)
    fecha_mensaje = models.DateTimeField(default=timezone.now)
    leido = models.BooleanField(default=False)
    mensaje = models.CharField(max_length=250)

    def __str__(self):
        return "Emisor: {} - Receptor:{}".format(self.emisor, self.receptor)





