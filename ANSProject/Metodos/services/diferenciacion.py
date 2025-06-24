from sympy import symbols, sympify
from sympy.utilities.lambdify import lambdify

def resolver_diferenciacion(fx_str, h, x_val):
    x = symbols('x')
    fx = sympify(fx_str)
    f = lambdify(x, fx, "math")

    aproximacion = (f(x_val + h) - f(x_val)) / h
    pasos = {
        "formula": f"(f(x + h) - f(x)) / h",
        "evaluacion": f"({f(x_val + h)} - {f(x_val)}) / {h}",
        "resultado": aproximacion
    }
    return {"resultado": aproximacion, "pasos": pasos}
