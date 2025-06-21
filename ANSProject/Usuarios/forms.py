from django import forms
from django.contrib.auth.models import User
from .models import UserProfile

from django import forms
from django.contrib.auth.models import User
from .models import UserProfile
import re

class SignUpForm(forms.ModelForm):
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        error_messages={'required': 'La contraseña es obligatoria.'}
    )
    password2 = forms.CharField(
        label='Confirmar contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        error_messages={'required': 'Por favor confirma tu contraseña.'}
    )

    full_name = forms.CharField(
        label='Nombre completo',
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        error_messages={'required': 'El nombre completo es obligatorio.'}
    )

    image = forms.ImageField(
        label='Imagen de perfil',
        required=False,
        widget=forms.ClearableFileInput(attrs={'class': 'form-control'})
    )

    career = forms.CharField(
        label='Carrera',
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        error_messages={'required': 'La carrera es obligatoria.'}
    )

    id_student = forms.CharField(
        label='ID de estudiante',
        max_length=30,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        error_messages={'required': 'El ID de estudiante es obligatorio.'}
    )

    class Meta:
        model = User
        fields = ['username', 'email']
        labels = {
            'username': 'Nombre de usuario',
            'email': 'Correo electrónico',
        }
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
        error_messages = {
            'username': {
                'required': 'El nombre de usuario es obligatorio.',
                'unique': 'Este nombre de usuario ya está en uso.',
            },
            'email': {
                'required': 'El correo electrónico es obligatorio.',
                'invalid': 'Ingresa un correo electrónico válido.',
                'unique': 'Este correo ya está registrado.',
            }
        }

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return p2

    def clean_id_student(self):
        id_student = self.cleaned_data.get('id_student')

        if not re.match(r'^[A-Za-z0-9]+$', id_student):
            raise forms.ValidationError("El ID de estudiante solo puede contener letras y números.")

        # Verificar que no exista otro con el mismo id_student
        from .models import UserProfile
        if UserProfile.objects.filter(id_student=id_student).exists():
            raise forms.ValidationError("Este ID de estudiante ya está registrado.")

        return id_student

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Este nombre de usuario ya está en uso.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Este correo ya está registrado.")
        return email
