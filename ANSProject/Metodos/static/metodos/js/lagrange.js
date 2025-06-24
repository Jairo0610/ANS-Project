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
const contenedorProcesos = document.getElementById('contenedorProcesos')
const contenedorInputs = document.getElementById('contenedorInputs');
const manejoProcesos = document.getElementById('manejoProcesos');

const tituloOperacion = document.getElementById('tituloOperacion');

const agregarPuntoBtn = document.getElementById('agregarPuntoBtn');
const solucionarBtn = document.getElementById('solucionarBtn');

// recibe para evitar recargar pagina
function confirmarSalida(e) {
    e.preventDefault();
}

// funcion para renderizar los inputs dependiendo de el metodo seleccionado
function seleccionarMetodo(metodo){
    contenedorProcesos.innerHTML = ''
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
                        <input type="number" class="form-control form-control-lg"
                        value="${punto.x}" oninput="actualizarPuntoPorIndice(${indice}, 'x', this.value)"
                        placeholder="Valor de X" step="any" required/>
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">F(X)</label>
                        <input type="number" class="form-control form-control-lg"
                        value="${punto.y}" oninput="actualizarPuntoPorIndice(${indice}, 'y', this.value)"
                        placeholder="Valor de F(X)" step="any" required/>
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
                        <input type="number" class="form-control form-control-lg"
                        value=""
                        oninput = "actualizarBotonSolucionar(); guardarDatosDiferenciacion('x',this.value);"
                        placeholder="Valor de X" required/>
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">h</label>
                        <input type="number"
                        class="form-control form-control-lg"
                        value=""
                        oninput = "actualizarBotonSolucionar(); guardarDatosDiferenciacion('h',this.value);"
                        placeholder="Valor de h" required/>
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label">Función</label>
                        <input type="input" class="form-control form-control-lg"
                        value=""
                        oninput = "actualizarBotonSolucionar(); guardarDatosDiferenciacion('funcion',this.value);"
                        placeholder="Ax² + Bx - C " required/>
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
function guardarDatosDiferenciacion(clave,valor){
    datosDiferenciacion[clave] = valor === '' ? '' : Number(valor);

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

// evita que se recargue pagina al enviar formulario (ambos metodos)
document.getElementById('formularioSolucion').addEventListener('submit', function(e) {
    e.preventDefault();

    console.log("Enviando datos");
    console.log(datosDiferenciacion)
    console.log(puntos)
});

async function resolverMetodo(){
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    await fetch('/metodos/procesar-lagrange/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken  // si usas protección CSRF
      },
      body: JSON.stringify({
        puntos: puntos
      })
    })
    .then(res => res.json())
    .then(data => {
    contenedorProcesos.innerHTML = '';

    if (metodoActual === 'lagrange') {
        let filas = '';
        let iteracion = '';
        let pasosPolinomio = '';
        let polinomioFinalLatex = '';

        // Mostrar puntos en tabla
        puntos.forEach((punto) => {
            filas += `
            <tr>
                <th scope="row">${punto.x}</th>
                <td>${punto.y}</td>
            </tr>`;
        });

        // Construir cada L_i(x) y mostrar
        data.lx.forEach((fraccion, index) => {
            const fx_i = puntos[index].y;
            const producto = `(${fx_i}) \\cdot \\left(${fraccion}\\right)`;

            iteracion += `
                <h4>Iteración ${index + 1}</h4>
                <p> \\(L_${index}(x) = ${fraccion}\\)</p>
                <p> \\(f(x_{${index}}) \\cdot L_${index}(x) = ${producto}\\)</p>
                <hr>
            `;

            // Sumar a la expresión de P(x)
            pasosPolinomio += producto + " + ";
        });

        // Eliminar último " + "
        if (pasosPolinomio.endsWith(" + ")) {
            pasosPolinomio = pasosPolinomio.slice(0, -3);
        }

        polinomioFinalLatex = `P(x) = ${pasosPolinomio}`;

        contenedorProcesos.innerHTML = `
        <h5>Teniendo los puntos con ${puntos.length} iteraciones</h5>
        <div class="row justify-content-center">
          <div class="col-12 col-md-5">
            <table class="table table-bordered text-center">
              <thead class="table-primary">
                <tr>
                  <th scope="col">\\( x_i \\)</th>
                  <th scope="col">\\( f(x_i)\\)</th>
                </tr>
              </thead>
              <tbody>
                ${filas}
              </tbody>
            </table>
          </div>
        </div>

        <h3 class="h4 mb-3 alert alert-info w-auto">
          <i class="bi bi-list-check me-2"></i>
          Paso 1 : Iteraciones para obtener los \\(L_i(x)\\)
        </h3>
        ${iteracion}

        <h3 class="h4 mb-3 alert alert-info w-auto">
          <i class="bi bi-list-check me-2"></i>
          Paso 2 : Sustitución para obtener \\( P(x) \\)
        </h3>
        <p> \\(${polinomioFinalLatex}\\) </p>

        <h3 class="h4 mb-3 alert alert-info w-auto">
          <i class="bi bi-check-circle me-2"></i>
          Paso 3 : Polinomio simplificado
        </h3>
        <p> \\(P(x) = ${data.polinomio}\\)</p>
        `;

        if (window.MathJax) {
            MathJax.typesetPromise();
        }

        console.log(data.polinomio);
        console.log(data.lx);
    }
});}