from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from .models import Profile

class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    full_name = forms.CharField(required=True, label='Nombre completo')
    id_student = forms.CharField(required=True, label='Número de carnet')
    career = forms.CharField(required=True, label='Carrera')
    image = forms.ImageField(required=True, label='Foto de perfil')

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=commit)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            # Crea o actualiza el perfil relacionado
            profile = Profile.objects.get_or_create(user=user)[0]
            profile.full_name = self.cleaned_data['full_name']
            profile.id_student = self.cleaned_data['id_student']
            profile.career = self.cleaned_data['career']
            profile.image = self.cleaned_data['image']
            profile.save()
        return user