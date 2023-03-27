from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Paises)
admin.site.register(Estados)
admin.site.register(Ciudades)
admin.site.register(Usuarios)
admin.site.register(Posts)
admin.site.register(Comentarios)
admin.site.register(Likes)
admin.site.register(Amigos)
admin.site.register(NotificacionesAmistad)