from django.shortcuts import render
from django.shortcuts import render

# Create your views here.
def solucionador_view(request):
    return render(request, 'solucionador.html')

