from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend


class FechaPublicacionFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(
                Q(fecha_publicacion__date__range=[fecha_inicio, fecha_fin])
                #Q(fecha_publicacion__gte=fecha_inicio) &
                #Q(fecha_publicacion__lte=fecha_fin)
            )
        elif fecha_inicio:
            queryset = queryset.filter(fecha_publicacion__date__gte=fecha_inicio)
        elif fecha_fin:
            queryset = queryset.filter(fecha_publicacion__date__lte=fecha_fin)

        return queryset


class FechaAltaFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(
                Q(fecha_alta__date__range=[fecha_inicio, fecha_fin])

                #Q(fecha_alta__gte=fecha_inicio) &
                #Q(fecha_alta__lte=fecha_fin)
            )
        elif fecha_inicio:
            queryset = queryset.filter(fecha_alta__date__gte=fecha_inicio)
        elif fecha_fin:
            queryset = queryset.filter(fecha_alta__date__lte=fecha_fin)

        return queryset
