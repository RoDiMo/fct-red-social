from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from main import views

router = DefaultRouter()
router.register(r'pais', views.Paises, basename='pais')
router.register(r'estado', views.Estados, basename='estado')
router.register(r'ciudad', views.Ciudades, basename='ciudad')
router.register(r'usuarios', views.Usuarios, basename='usuarios')
router.register(r'posts', views.Posts, basename='posts')
router.register(r'comentarios', views.Comentarios, basename='comentarios')
router.register(r'likes', views.Likes, basename='likes')
router.register(r'amigos', views.Amigos, basename='amigos')
router.register(r'notificacionesamistad', views.NotificacionesAmistad, basename='notificacionesamistad')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path(r'api-auth/', include('rest_framework.urls', namespace='rest_framework')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
