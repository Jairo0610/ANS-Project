from django.db import models
from django.contrib.auth.models import User
import json

# Create your models here.
class Historial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20)  # 'Lagrange' o 'Diferenciacion'
    datos = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Se guarda la fecha y hora de creación

    def set_datos(self, datos_dict):
        self.datos = json.dumps(datos_dict)

    def get_datos(self):
        return json.loads(self.datos)

    def __str__(self):
        return f"{self.tipo} - {self.fecha_creacion.strftime('%Y-%m-%d %H:%M:%S')}"