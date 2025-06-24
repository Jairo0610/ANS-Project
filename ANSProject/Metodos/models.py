from django.db import models
from django.contrib.auth.models import User
import json

# Create your models here.
class Historial(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20)  # 'Lagrange' o 'Diferenciacion'
    datos = models.TextField()

    def set_datos(self, datos_dict):
        self.datos = json.dumps(datos_dict)

    def get_datos(self):
        return json.loads(self.datos)