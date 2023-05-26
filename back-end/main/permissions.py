from rest_framework import permissions


# Comprueba que el usuario es moderador o admin
class EsAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True


# Comprueba que el usuario es moderador o admin
class EsModeradorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.es_moderador:
            return True


class EsPropietarioPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Verificar si el usuario es el propietario del objeto
        return obj == request.user


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Permite las solicitudes GET, HEAD u OPTIONS, que son seguras.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Verifica si el usuario autenticado es el propietario del objeto.
        return obj.usuario == request.user


def permisos_usuarios(action):
    permission_classes = [permissions.IsAuthenticated]

    if action in ['create', 'update', 'partial_update', 'destroy']:
        permission_classes = [permissions.IsAuthenticated, EsAdminPermission]
    if action in ['create','update', 'destroy']:
        permission_classes = [EsPropietarioPermission | EsAdminPermission]
    if action in ['create','update']:
        permission_classes = [EsModeradorPermission | EsPropietarioPermission | EsAdminPermission]
    if action == 'create':
        permission_classes = [permissions.AllowAny]

    return [permission() for permission in permission_classes]




def permisos_posts(action):
    permission_classes = [permissions.IsAuthenticated]
    if action in ['create', 'update', 'partial_update', 'destroy']:
        permission_classes = [permissions.IsAuthenticated, EsAdminPermission]
    if action in ['create','update', 'destroy']:
        permission_classes = [IsOwnerOrReadOnly | EsAdminPermission]
    if action in ['create','update']:
        permission_classes = [EsModeradorPermission | IsOwnerOrReadOnly | EsAdminPermission]
    if action == 'create':
        permission_classes = [permissions.AllowAny]

    return [permission() for permission in permission_classes]




