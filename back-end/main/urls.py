from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view
from main import views

router = DefaultRouter()
router.register(r'paises', views.Paises, basename='paises')
router.register(r'estados', views.Estados, basename='estados')
router.register(r'ciudades', views.Ciudades, basename='ciudades')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

]
