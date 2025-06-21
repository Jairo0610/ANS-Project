from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    career = models.CharField(max_length=100)
    id_student = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.user.username
