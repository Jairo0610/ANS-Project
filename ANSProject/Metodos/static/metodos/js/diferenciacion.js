// variables para lagrange
let metodoActual = null;
let puntos = [];
let minimoPuntos = 0;

// objeto literal para diferenciacion
let datosDiferenciacion = {
    x: null,
    h: null,
    funcion: null
}

const contenedorSeleccionarMetodo = document.getElementById('contenedorSeleccionarMetodo');
const contenedorInputs = document.getElementById('contenedorInputs');
const manejoProcesos = document.getElementById('manejoProcesos');

const tituloOperacion = document.getElementById('tituloOperacion');

const agregarPuntoBtn = document.getElementById('agregarPuntoBtn');
const solucionarBtn = document.getElementById('solucionarBtn');

const limpiarBtn = document.getElementById('limpiarBtn');
limpiarBtn.addEventListener('click', limpiarTodo);


// recibe para evitar recargar pagina
function confirmarSalida(e) {
    e.preventDefault();
}

// funcion para renderizar los inputs dependiendo de el metodo seleccionado
function seleccionarMetodo(metodo){
    // crea un boton para retroceder la vista
    const botonRetroceder = document.createElement('button');
    botonRetroceder.id = 'botonRetroceder';
    botonRetroceder.className = 'btn btn-secondary mb-3 d-inline-flex align-items-center';
    botonRetroceder.innerHTML = `<i class="bi bi-arrow-left-short me-1"></i>Atrás`;
    
    botonRetroceder.onclick = () => {
        if(confirm('¿Estás seguro? Se perderán los datos ingresados si no se ha relizado la solución')){
            manejoProcesos.style.display = 'none';
            contenedorSeleccionarMetodo.style.display = 'block';
            botonRetroceder.remove()

            // quita el evento para que no pregunte al recargar fuera de la solucion del metodo
            removeEventListener('beforeunload', confirmarSalida);
            metodoActual = null;
            puntos = [];
            minimoPuntos = 0;
        }else{
            return
        }
    };

    //inserta como primer hijo el boton
    manejoProcesos.insertBefore(botonRetroceder, manejoProcesos.firstChild);
    
    //reset de metodo seleccionado y arreglo para lagrange
    metodoActual = metodo
    puntos.length = 0

    if(metodo === 'lagrange'){
        tituloOperacion.textContent = 'Interpolación de Lagrange';
        minimoPuntos = 2;

        //genera una card de inputs para metodo lagrange (minimo 2)
        for (let i = 0; i < minimoPuntos; i++) {
        puntos.push({ x: '', y: '' });
        }
        renderizarInputs();
    }else{
        tituloOperacion.textContent = 'Diferenciación Numérica';
        renderizarInputs()
    }

    // esconde el modo de seleccion y muestra el manejo de procesos (vista)
    contenedorSeleccionarMetodo.style.display = 'none';
    manejoProcesos.style.display = 'block';

    actualizarBotonSolucionar()

    // previene que recargue la pagina hasta confirmar
    addEventListener('beforeunload', confirmarSalida);
};

//renderiza los inputs segun metodo seleccionado
function renderizarInputs(){
    contenedorInputs.innerHTML = '';
    
    if(metodoActual === 'lagrange'){
        document.getElementById('agregarPuntoBtn').style.display = 'block'

        //recorre los objetosPunto con su indice
        puntos.forEach((punto, indice) => {
            const elementoPunto = document.createElement('div');
            elementoPunto.className = 'col-4';

            //genera el boton de borrar en el input-card si es > 2 (para lagrange)
            let removerBtn = '';
            if (puntos.length > minimoPuntos) {
                removerBtn = `
                <button onclick="borrarPuntoPorIndice(${indice})"
                    class="btn btn-sm btn-outline-danger"
                    aria-label="Remove coordinate">
                    <i class="bi bi-trash"></i>
                </button>
                `;
            }

            //genera input-card (lagrange)
            elementoPunto.innerHTML = `
            <div class="card border-primary input-card">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                    <span class="badge bg-primary badge-index me-2">${indice + 1}</span>
                    Punto
                    </h5>
                    ${removerBtn}
                </div>
                <div class="card-body">
                    <div class="row">
                    <div class="col-6 mb-3">
                        <label class="form-label">X</label>
                        <input type="number" step="any" class="form-control form-control-lg"
                        value="${punto.x}" oninput="actualizarPuntoPorIndice(${indice}, 'x', this.value)"
                        placeholder="Valor de X" required/>
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">F(X)</label>
                        <input type="number" step="any" class="form-control form-control-lg"
                        value="${punto.y}" oninput="actualizarPuntoPorIndice(${indice}, 'y', this.value)"
                        placeholder="Valor de F(X)" required/>
                    </div>
                    </div>
                </div>
            </div>
            `;

            contenedorInputs.appendChild(elementoPunto);
        });
    }else{
        // genera el input-card para diferenciacion numerica
        document.getElementById('agregarPuntoBtn').style.display = 'none'
        const elementoProcesoDif = document.createElement('div')
        elementoProcesoDif.className = 'col-6';

        elementoProcesoDif.innerHTML = `
        <div class="card border-primary input-card">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                <span class="badge bg-primary badge-index me-2">Datos</span>
                </h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-6 mb-3">
                        <label class="form-label">X</label>
                        <input type="number" step="any" inputmode="decimal"
                            class="form-control form-control-lg"
                            value=""
                            oninput="actualizarBotonSolucionar(); guardarDatosDiferenciacion('x',this.value);"
                            placeholder="Valor de X" required
                        />
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">h</label>
                        <input type="number" step="any" inputmode="decimal"
                            class="form-control form-control-lg"
                            value=""
                            oninput="actualizarBotonSolucionar(); guardarDatosDiferenciacion('h',this.value);"
                            placeholder="Valor de h" required
                        />
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label">Función</label>
                        <input type="input" class="form-control form-control-lg"
                        value=""
                        oninput = "actualizarBotonSolucionar(); guardarDatosDiferenciacion('funcion',this.value);"
                        placeholder="a*x^2 + b*x - c " required/>
                    </div>
                </div>
            </div>
        </div>
        `

        contenedorInputs.appendChild(elementoProcesoDif);
    }
}

//metodo para agregarPuntoBtn (lagrange)
function agregarPunto() {
    puntos.push({ x: '', y: '' });
    renderizarInputs();
    actualizarBotonSolucionar()
}

//listener para agregar un nuevo input (lagrange)
agregarPuntoBtn.addEventListener('click', agregarPunto);

// guarda los datos para diferenciacio numerica (al escribir en el formulario)
function guardarDatosDiferenciacion(clave, valor) {
    if (clave === 'funcion') {
        // para la función guardamos la cadena tal cual
        datosDiferenciacion[clave] = valor;
    } else {
        // para x y h, convertimos a número solo si no está vacío
        datosDiferenciacion[clave] = valor === '' ? '' : Number(valor);
    }
    actualizarBotonSolucionar();
}



// funcion para actualizar cambios de los inputs hechos por el usuario (lagrange)
function actualizarPuntoPorIndice(indice, coordenada, valor) {
    const punto = puntos[indice];
    
    if (punto) {
        //terniario para evitar que se guarde 0 al borrar entrada (lagrange)
        punto[coordenada] = valor === '' ? '' : Number(valor);

        console.log(`N de puntos actuales -> ${puntos.length}`)
        console.log(`Indice ${indice}, coordenada ${coordenada}, Par (${punto.x},${punto.y})`)
        console.log('Array actual')
        console.log(puntos)
        actualizarBotonSolucionar()
    }
}

// borra el input-card del punto (lagrange)
function borrarPuntoPorIndice(index) {
    if (puntos.length > minimoPuntos) {
        puntos.splice(index, 1);
        renderizarInputs();
    } else { 
        alert(`Debes tener al menos ${minimoPuntos} puntos.`);
    }
    actualizarBotonSolucionar()
}

//validacion para activar o desactivar el boton solucionar del formulario (ambos metodos)
function actualizarBotonSolucionar() {
    if (document.getElementById('formularioSolucion').checkValidity()) {
        solucionarBtn.disabled = false
    } else {
        solucionarBtn.disabled = true
    }

    console.log(`Estado actual del boton solucionar ${solucionarBtn.disabled}`)
}


function limpiarTodo() {
    // 1) limpiamos resultados
    const cont = document.getElementById('conteneroProcesos');
    cont.innerHTML = '';

    // 2) reiniciamos datos para diferenciación
    if (metodoActual === 'diferenciacion') {
        datosDiferenciacion.x = '';
        datosDiferenciacion.h = '';
        datosDiferenciacion.funcion = '';
    }
    // 3) reiniciamos datos para lagrange (si estuviera seleccionado)
    else if (metodoActual === 'lagrange') {
        puntos = puntos.map(_ => ({ x: '', y: '' }));
    }

    // 4) volvemos a renderizar los inputs vacíos
    renderizarInputs();

    // 5) deshabilitamos el botón “Solucionar” hasta que vuelvan a llenarlos
    actualizarBotonSolucionar();
}




function resolverDiferenciacion() {
    // Helper para redondear a 6 decimales
    const round6 = n => Number(n.toFixed(6));

    const { x, h, funcion } = datosDiferenciacion;
    if (x === '' || h === '' || !funcion.trim()) return;

    // Helper: convierte "A/B" en "\frac{A}{B}" solo si hay '/'
    function toFracLatex(str) {
        if (!str.includes('/')) return str.replace(/\*/g, ' ');
        const s = str.trim().replace(/^\(+|\)+$/g, '');
        const i = s.lastIndexOf('/');
        const num = s.slice(0, i), den = s.slice(i + 1);
        return `\\frac{${num.replace(/\*/g,' ')}}{${den}}`;
    }

    // LaTeX de la función original y de las sustituciones
    const latexFuncion = toFracLatex(funcion);
    const exprX       = funcion.replace(/x/g, `(${x})`);
    const exprXh      = funcion.replace(/x/g, `(${x}+${h})`);
    const exprXmh     = funcion.replace(/x/g, `(${x}-${h})`);
    const latexX      = toFracLatex(exprX);
    const latexXh     = toFracLatex(exprXh);
    const latexXmh    = toFracLatex(exprXmh);

    // Preparamos y evaluamos la función
    const exprJS = funcion.replace(/\^/g, '**');
    const f      = new Function('x', `return ${exprJS};`);
    const fx     = round6(f(x));
    const fxh    = round6(f(x + h));
    const fxmh   = round6(f(x - h));

    // Calculamos numeradores y diferencias
    const numAdel  = round6(fxh - fx);
    const numAtras = round6(fx - fxmh);
    const numCent  = round6(fxh - fxmh);
    const adelante = round6(numAdel  / h);
    const atras    = round6(numAtras / h);
    const central  = round6(numCent  / (2 * h));

    // Fórmulas generales por método
    const formulas = {
        'Diferencia hacia adelante': '\\frac{f(x+h)-f(x)}{h}',
        'Diferencia hacia atrás':    '\\frac{f(x)-f(x-h)}{h}',
        'Diferencia central':        '\\frac{f(x+h)-f(x-h)}{2h}'
    };

    // Vaciamos resultados anteriores
    const cont = document.getElementById('conteneroProcesos');
    cont.innerHTML = '';

    // Definimos los tres métodos y sus pasos
    const metodos = [
        {
        titulo: 'Diferencia hacia adelante',
        pasos: [
            `\\(f(x+h) = ${latexXh} = ${fxh}\\)`,
            `\\(f(x)   = ${latexX}  = ${fx}\\)`,
            `\\(f(x+h)-f(x) = ${numAdel}\\)`,
            `\\(\\frac{${numAdel}}{${h}} = ${adelante}\\)`
        ]
        },
        {
        titulo: 'Diferencia hacia atrás',
        pasos: [
            `\\(f(x)   = ${latexX}   = ${fx}\\)`,
            `\\(f(x-h) = ${latexXmh} = ${fxmh}\\)`,
            `\\(f(x)-f(x-h) = ${numAtras}\\)`,
            `\\(\\frac{${numAtras}}{${h}} = ${atras}\\)`
        ]
        },
        {
        titulo: 'Diferencia central',
        pasos: [
            `\\(f(x+h) = ${latexXh} = ${fxh}\\)`,
            `\\(f(x-h) = ${latexXmh} = ${fxmh}\\)`,
            `\\(f(x+h)-f(x-h) = ${numCent}\\)`,
            `\\(\\frac{${numCent}}{2\\times${h}} = ${central}\\)`
        ]
        }
    ];

    // Renderizamos cada método
    metodos.forEach(m => {
        const card = document.createElement('div');
        card.className = 'alert alert-light border-primary p-4 mb-5';

        // Título del método
        const titulo = document.createElement('h5');
        titulo.className = 'text-center mb-4';
        titulo.textContent = m.titulo;
        card.appendChild(titulo);

        // --- Sección DATOS ---
        const datosHeader = document.createElement('h6');
        datosHeader.className = 'fw-bold mb-3';
        datosHeader.textContent = 'DATOS';
        card.appendChild(datosHeader);

        const datosList = document.createElement('ul');
        datosList.className = 'list-unstyled mb-5';

        // Función original
        const liFunc = document.createElement('li');
        liFunc.className = 'fs-5 mb-3 text-center';
        liFunc.innerHTML = `\\(f(x) = ${latexFuncion}\\)`;
        datosList.appendChild(liFunc);

        // Fórmula de cálculo
        const liFormula = document.createElement('li');
        liFormula.className = 'fs-5 mb-3 text-center';
        liFormula.innerHTML = `\\(\\text{Fórmula: }${formulas[m.titulo]}\\)`;
        datosList.appendChild(liFormula);

        // x y h en LaTeX
        const liX = document.createElement('li');
        liX.className = 'fs-5 mb-2 text-center';
        liX.innerHTML = `\\(x = ${x}\\)`;
        datosList.appendChild(liX);

        const liH = document.createElement('li');
        liH.className = 'fs-5 text-center';
        liH.innerHTML = `\\(h = ${h}\\)`;
        datosList.appendChild(liH);

        card.appendChild(datosList);

        // --- Sección SOLUCIÓN ---
        const solHeader = document.createElement('h6');
        solHeader.className = 'fw-bold mb-3';
        solHeader.textContent = 'SOLUCIÓN';
        card.appendChild(solHeader);

        const solList = document.createElement('ul');
        solList.className = 'list-unstyled';

        m.pasos.forEach(tex => {
        const li = document.createElement('li');
        li.className = 'fs-5 mb-3 text-center';
        li.innerHTML = tex;
        solList.appendChild(li);
        });

        card.appendChild(solList);
        cont.appendChild(card);
    });

    // Forzamos render de MathJax
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    }
}

document
  .getElementById('formularioSolucion')
  .addEventListener('submit', function(e) {
    e.preventDefault();
    if (metodoActual === 'diferenciacion') {
      resolverDiferenciacion();
    } else {
      resolverLagrange();
    }
  });
