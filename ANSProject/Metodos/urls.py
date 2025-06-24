from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path, include

app_name = 'metodos'

urlpatterns = [
    #path('solucionador/', views.solucionador_view, name='solucionador'),
    path('procesar-lagrange/', views.procesar_lagrange, name='procesar_lagrange'),
    path('lagrange/', views.solucionador_view, name='lagrange'),
    path('diferenciacion/', views.solucionadorD_view, name='diferenciacion'),    
    path('historial/', views.historial_view, name='ver_historial'),
]