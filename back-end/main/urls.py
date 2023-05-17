from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path, reverse_lazy
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter

from main import views

router = DefaultRouter()
router.register(r'pais', views.Paises, basename='pais')
router.register(r'estado', views.Estados, basename='estado')
router.register(r'ciudad', views.Ciudades, basename='ciudad')
router.register(r'usuarios', views.Usuario, basename='usuarios')
router.register(r'posts', views.Post, basename='posts')
router.register(r'comentarios', views.Comentarios, basename='comentarios')
router.register(r'likes', views.Likes, basename='likes')
router.register(r'amigos', views.Amigo, basename='amigos')
router.register(r'notificacionesamistad', views.NotificacionesAmistad, basename='notificacionesamistad')
router.register(r'chat', views.Chats, basename='chat')
router.register(r'amistadescanceladas', views.AmistadesCanceladas, basename='amistadescanceladas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api-user-login/', views.UserLogIn.as_view()),
    path('registro/', views.RegistroUsuario.as_view()),
    path(r'api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
