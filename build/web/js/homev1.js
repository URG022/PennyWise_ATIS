// home.js - Optimizado para JSP con localStorage

// =========================================================================
// 1. VARIABLES GLOBALES
// =========================================================================
let currentUser = null;
let colores = ["primary", "secondary", "info", "warning", "danger"];

window.limitePresupuestoGlobal = null;
window.registrosPresupuestoGlobal = null;

// =========================================================================
// 2. VALIDACIÓN DE USUARIO
// =========================================================================
function validarUsuario() {
    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
            window.location.href = "index.jsp";
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error al validar usuario:", error);
        window.location.href = "index.jsp";
        return false;
    }
}

// =========================================================================
// 3. OBTENER DATOS DE LOCALSTORAGE
// =========================================================================
function obtenerDatos() {
    try {
        const limitesPresupuesto = JSON.parse(
                localStorage.getItem(`limitesDePresupuesto_${currentUser.email}`)
                ) || [];

        const registros = JSON.parse(
                localStorage.getItem(`registros_${currentUser.email}`)
                ) || [];

        const metas = JSON.parse(
                localStorage.getItem(`metas_${currentUser.email}`)
                ) || [];

        return {limitesPresupuesto, registros, metas};
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return {limitesPresupuesto: [], registros: [], metas: []};
    }
}

// =========================================================================
// 4. FUNCIÓN PRINCIPAL AL CARGAR EL DOM
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
    // Validar usuario antes de continuar
    if (!validarUsuario()) {
        return;
    }

    try {
        // Obtener datos una sola vez
        const datos = obtenerDatos();

        // Inicializar todas las secciones
        initResumen(datos.limitesPresupuesto, datos.registros);
        initMetas(datos.metas);
        initAlertas(datos.limitesPresupuesto, datos.registros, datos.metas);

    } catch (error) {
        console.error("Error al inicializar la página:", error);
    }
});

// =========================================================================
// 5. SECCIÓN: RESUMEN
// =========================================================================
function initResumen(limitesPresupuesto, registros) {
    try {
        const tbodyAppend = document.getElementById("tbody-resume");
        if (!tbodyAppend) {
            console.warn("Elemento tbody-resume no encontrado");
            return;
        }

        tbodyAppend.innerHTML = "";

        // Calcular ingresos por categoría
        const ingresos = registros
                .filter(r => r.tipo === "Ingreso")
                .reduce((acc, curr) => {
                    if (!acc[curr.categoria]) {
                        acc[curr.categoria] = 0;
                    }
                    acc[curr.categoria] += curr.monto;
                    return acc;
                }, {});

        // Agregar fila de ingresos totales
        if (Object.keys(ingresos).length > 0) {
            const totalIngresos = Object.values(ingresos).reduce(
                    (sum, monto) => sum + monto,
                    0
                    );

            const filaIngreso = document.createElement("tr");
            filaIngreso.classList.add("table-success");
            filaIngreso.innerHTML = `
                <td>Ingresos</td>
                <td>$ ${totalIngresos.toFixed(2)}</td>
            `;
            tbodyAppend.appendChild(filaIngreso);
        }

        // Agregar filas de límites de presupuesto
        if (limitesPresupuesto.length > 0) {
            limitesPresupuesto.forEach(limite => {
                const colorIndex = obtenerIndiceColor(limite.categoria);
                const fila = document.createElement("tr");
                fila.classList.add(`table-${colores[colorIndex]}`);
                fila.innerHTML = `
                    <td>${limite.categoria}</td>
                    <td>$ ${limite.limite.toFixed(2)}</td>
                `;
                tbodyAppend.appendChild(fila);
            });
        }

        // Mostrar mensaje si no hay datos
        if (limitesPresupuesto.length === 0 && Object.keys(ingresos).length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td colspan="2" class="text-muted">Sin Categorías</td>
            `;
            tbodyAppend.appendChild(fila);
        }

    } catch (error) {
        console.error("Error en initResumen:", error);
    }
}

// =========================================================================
// 6. SECCIÓN: METAS
// =========================================================================
function initMetas(metas) {
    try {
        const tbodyAppend = document.getElementById("tbody-metas");
        if (!tbodyAppend) {
            console.warn("Elemento tbody-metas no encontrado");
            return;
        }

        tbodyAppend.innerHTML = "";

        if (metas.length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td colspan="2" class="text-muted">Sin Metas</td>
            `;
            tbodyAppend.appendChild(fila);
        } else {
            metas.forEach(meta => {
                const mensualidad = calcularMensualidad(meta.objetivo, meta.periodos);
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${meta.nombre}</td>
                    <td>$ ${mensualidad}</td>
                `;
                tbodyAppend.appendChild(fila);
            });
        }

    } catch (error) {
        console.error("Error en initMetas:", error);
    }
}

// Función auxiliar para calcular mensualidad
function calcularMensualidad(objetivo, periodos) {
    if (!objetivo || !periodos || periodos === 0) {
        return "0.00";
    }
    const resultado = objetivo / periodos;
    return isNaN(resultado) ? "0.00" : resultado.toFixed(2);
}

// =========================================================================
// 7. SECCIÓN: ALERTAS
// =========================================================================
function initAlertas(limitesPresupuesto, registros, metas) {
    try {
        const cardAlert = document.getElementById("cardAlert");
        const msgAlert = document.getElementById("msgAlert");

        if (!cardAlert || !msgAlert) {
            console.warn("Elementos de alerta no encontrados");
            return;
        }

        // Limpiar alertas previas
        msgAlert.textContent = "";
        cardAlert.innerHTML = "";

        // Calcular gastos por categoría
        const sumGastosByCategory = calcularGastosPorCategoria(registros, metas);

        // Generar alertas para categorías con más del 75% gastado
        if (limitesPresupuesto.length > 0) {
            limitesPresupuesto.forEach(limite => {
                const categoria = limite.categoria;
                const limiteValue = limite.limite;
                const gastado = sumGastosByCategory[categoria] || 0;
                const porcentaje = limiteValue > 0 ? (gastado / limiteValue) * 100 : 0;

                if (porcentaje > 75) {
                    crearAlerta(cardAlert, categoria, gastado, limiteValue, porcentaje);
                }
            });
        }

        // Asignar datos globales para graficas.js
        window.limitePresupuestoGlobal = limitesPresupuesto;
        window.registrosPresupuestoGlobal = sumGastosByCategory;

        // Llamar a inicialización de gráficas si existe
        if (typeof initGraficas === 'function') {
            initGraficas();
        }

    } catch (error) {
        console.error("Error en initAlertas:", error);
    }
}

// Función auxiliar para calcular gastos por categoría
function calcularGastosPorCategoria(registros, metas) {
    let sumGastosByCategory = {};

    if (!registros || registros.length === 0) {
        return sumGastosByCategory;
    }

    // Filtrar solo gastos
    const gastos = registros.filter(r => r.tipo === "Gasto");

    // Calcular provisiones de metas (aportes)
    let provisiones = 0;
    if (metas && metas.length > 0) {
        provisiones = metas.reduce((total, meta) => {
            if (!meta.history)
                return total;
            return total + meta.history.reduce((sum, historial) => {
                return historial.action === "aporte"
                        ? sum + Number(historial.amount || 0)
                        : sum;
            }, 0);
        }, 0);
    }

    // Sumar gastos por categoría
    if (gastos.length > 0) {
        sumGastosByCategory = gastos.reduce((acc, curr) => {
            if (!acc[curr.categoria]) {
                acc[curr.categoria] = 0;
            }
            acc[curr.categoria] += curr.monto;

            // Agregar provisiones a la categoría Ahorro
            if (curr.categoria === "Ahorro" && provisiones > 0) {
                if (!acc["Provisiones"]) {
                    acc["Provisiones"] = 0;
                }
                acc["Provisiones"] += provisiones;
            }

            return acc;
        }, {});
    }

    return sumGastosByCategory;
}

// Función auxiliar para crear alertas
function crearAlerta(cardAlert, categoria, gastado, limite, porcentaje) {
    const colorIndex = obtenerIndiceColor(categoria);
    const alerta = document.createElement("div");
    alerta.className = "my-1 mx-md-5";
    alerta.innerHTML = `
        <div class="alert mx-md-5 alert-${colores[colorIndex]}" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" 
                 class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div class="flex-grow-1">
                ¡Cuidado! Te queda poco presupuesto en 
                <strong class="mb-1">${categoria}</strong>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Gastado: <strong>$${gastado.toFixed(2)}</strong> / $${limite.toFixed(2)}</span>
                    <span class="badge bg-dark ms-2">${porcentaje.toFixed(1)}%</span>
                </div>
                <div class="progress mt-2" style="height: 6px;">
                    <div class="progress-bar bg-danger" role="progressbar" 
                         style="width: ${porcentaje}%" 
                         aria-valuenow="${porcentaje}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </div>
        </div>
    `;
    cardAlert.appendChild(alerta);
}

// =========================================================================
// 8. FUNCIONES AUXILIARES
// =========================================================================
function obtenerIndiceColor(categoria) {
    switch (categoria) {
        case "Deudas":
            return 4; // danger
        case "Ahorro":
            return 2; // info
        case "Gastos Fijos":
            return 1; // secondary
        case "Gastos Variables":
            return 3; // warning
        default:
            return 0; // primary
    }
}