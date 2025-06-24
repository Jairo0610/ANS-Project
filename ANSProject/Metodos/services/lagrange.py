from sympy import symbols, simplify, expand

def resolver_lagrange(puntos):
    x = symbols('x')
    n = len(puntos)
    pasos = []
    resultado = 0

    for i in range(n):
        xi, yi = puntos[i]
        Li = 1
        formula = "L{}(x) = ".format(i)
        for j in range(n):
            if i != j:
                xj, _ = puntos[j]
                Li *= (x - xj) / (xi - xj)
                formula += f"((x - {xj})/({xi} - {xj})) * "
        Li = simplify(Li)
        formula = formula.rstrip(" * ")
        term = yi * Li
        resultado += term
        pasos.append({"L": f"L{i}(x)", "formula": formula, "Li": str(Li), "yi": yi, "term": str(term)})

    polinomio = expand(resultado)
    return {"polinomio": str(polinomio), "pasos": pasos}
