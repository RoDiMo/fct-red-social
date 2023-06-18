from rest_framework.test import APITestCase

from main.models import Paises


class BaseTest(APITestCase):
    def setUp(self):
        self.paises = Paises.objects.create(id='247', nombre_pais='Cubaa')