from django.contrib import admin
from django.urls import path
from . import views

# app_name = 'usuarios'
urlpatterns = [
    path('', views.loginView, name='login'),
    path('logout/', views.logoutView, name='logout'),
    path('inicio/', views.inicioView, name='inicio'),
    path('/signup/', views.signUpView, name='signup'),
]