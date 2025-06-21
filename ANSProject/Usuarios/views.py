from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User

from django.contrib.auth.decorators import login_required
from .forms import SignUpForm
from .models import UserProfile
from django.contrib import messages
# Create your views here.

def loginView(request):
    if request.method == "POST":
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('inicio')
        else:
            return render(request, 'auth/login.html', {'form': form, 'error': 'Credenciales incorrectas'})
    else:
        form = AuthenticationForm()
    logout(request)
    return render(request, 'auth/login.html', {'form': form})
def logoutView(request):
    logout(request)
    return redirect('login')

def inicioView(request):
    return render(request, 'inicio.html')

def signUpView(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST, request.FILES)

        if form.is_valid():  # Solo continúa si todo es válido
            # Guardar el usuario
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'].lower(),
                password=form.cleaned_data['password1']
            )

            # Guardar el perfil adicional
            UserProfile.objects.create(
                user=user,
                full_name=form.cleaned_data['full_name'].title().replace('  ', ' '),
                image=form.cleaned_data.get('image'),
                career=form.cleaned_data['career'].title(),
                id_student=form.cleaned_data['id_student'].upper()
            )

            return redirect('login')  # Redirigir después del registro

    else:
        form = SignUpForm()
    return render(request, 'auth/signup.html', {'form': form})