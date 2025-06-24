from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Historial
import json
import numpy as np
import sympy as sp
from sympy import symbols, expand, sympify

# Create your views here.
def solucionador_view(request):
    return render(request, 'lagrange.html')

# Clase Lagrange
class Lagrange:
    def __init__(self, x, y):
        self.x = np.array(x)
        self.y = np.array(y)
        self.fracciones_Lx = np.empty(len(self.x), dtype=object)

    def guardar_fraccion(self, numerador, denominador, indice):
        self.fracciones_Lx[indice] = (numerador, denominador)

    def calcularLx(self):
        x = symbols('x')
        arrayL = np.empty(len(self.x), dtype=object)

        for i in range(len(self.x)):
            numerador = 1
            denominador = 1
            for j in range(len(self.x)):
                if j != i:
                    numerador *= expand(x - self.x[j])
                    denominador *= expand(self.x[i] - self.x[j])

            self.guardar_fraccion(numerador, denominador, i)

            respuesta = sympify(numerador / denominador)
            arrayL[i] = respuesta

        return arrayL

    def calcularPolinomio(self, Lx):
        polinomio = 0
        for i in range(len(self.y)):
            polinomio += expand(self.y[i] * Lx[i])
        polinomio = sympify(expand(polinomio))
        return polinomio

def procesar_lagrange(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            puntos = datos.get('puntos', [])

            x_values = [p['x'] for p in puntos]
            y_values = [p['y'] for p in puntos]

            lagrange = Lagrange(x_values, y_values)
            Lx = lagrange.calcularLx()
            polinomio = lagrange.calcularPolinomio(Lx)

            historial = Historial(
                user=request.user,
                tipo='Lagrange'
            )
            historial.set_datos({
                'puntos': puntos,
                'polinomio': str(polinomio)
            })
            historial.save()

            return JsonResponse({
                'status': 'ok',
                'polinomio': str(polinomio),
                'lx': [sp.latex(l) for l in Lx]
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

def solucionadorD_view(request):
    return render(request, 'diferenciacion.html')

def historial_view(request):
    historial = Historial.objects.filter(user=request.user).order_by('-fecha_creacion')

    # Convertimos datos JSON a diccionario para facilitar su uso en el template
    for h in historial:
        h.datos_dict = h.get_datos()

    return render(request, 'historial.html', {'historial': historial})