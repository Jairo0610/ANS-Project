from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm
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
    return render(request, 'auth/login.html', {'form': form})
def logoutView(request):
    logout(request)
    return redirect('login')

def inicioView(request):
    return render(request, 'inicio.html')

def signUpView(request):
    if request.method == "POST":
        form = SignUpForm(request.POST, request.FILES)  # IMPORTANTE: request.FILES
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('login')  # redirige donde quieras
        else:
            return render(request, 'auth/signup.html', {'form': form})
    else:
        form = SignUpForm()
    return render(request, 'auth/signup.html', {'form': form})