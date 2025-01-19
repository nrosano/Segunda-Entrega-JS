
const invoiceForm = document.getElementById("invoiceForm");
const resultsDiv = document.getElementById("results");
const filterMonth = document.getElementById("filterMonth");
const filterButton = document.getElementById("filterButton");
const processButton = document.getElementById("processButton");
const resetButton = document.getElementById("resetButton");


let facturas = JSON.parse(localStorage.getItem("facturas")) || [];


function Factura(fecha, monto) {
  this.fecha = fecha;
  this.monto = parseFloat(monto);
}


function guardarFacturas() {
  localStorage.setItem("facturas", JSON.stringify(facturas));
}


function mostrarFacturas(filtradas = facturas) {
  resultsDiv.innerHTML = ""; // Limpiar resultados
  if (filtradas.length === 0) {
    resultsDiv.innerHTML = `
      <p class="text-muted text-center">No hay facturas para mostrar.</p>`;
    return;
  }

  filtradas.forEach((f) => {
    const card = document.createElement("div");
    card.className = "card mb-2 shadow-sm";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Fecha: ${f.fecha}</h5>
        <p class="card-text">Monto: $${f.monto.toFixed(2)}</p>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

// Agregar nueva factura
invoiceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = document.getElementById("date").value;
  const monto = parseFloat(document.getElementById("amount").value);

  if (fecha && !isNaN(monto)) {
    const nuevaFactura = new Factura(fecha, monto);
    facturas.push(nuevaFactura);
    guardarFacturas();
    mostrarFacturas();
    invoiceForm.reset();
  } else {
    resultsDiv.innerHTML = `
      <p class="text-danger text-center">Por favor, ingrese datos válidos.</p>`;
  }
});

// Filtrar facturas
filterButton.addEventListener("click", () => {
  const filtro = filterMonth.value;
  if (!filtro) {
    resultsDiv.innerHTML = `
      <p class="text-warning text-center">Seleccione un mes y año para filtrar.</p>`;
    return;
  }
  const filtradas = facturas.filter((f) => f.fecha.startsWith(filtro));
  mostrarFacturas(filtradas);
});

// Procesar facturas
processButton.addEventListener("click", () => {
  if (facturas.length === 0) {
    resultsDiv.innerHTML = `
      <p class="text-warning text-center">No hay facturas para procesar.</p>`;
    return;
  }

  const porMes = facturas.reduce((acc, f) => {
    const mes = f.fecha.slice(0, 7);
    acc[mes] = (acc[mes] || 0) + f.monto;
    return acc;
  }, {});

  resultsDiv.innerHTML = `
    <h4 class="text-center">Resultados del  procesamiento</h4>`;

  Object.entries(porMes).forEach(([mes, total]) => {
    let accion = "Sin acción";
    if (total >= 2000 && total < 10000) accion = "Informar  cliente";
    else if (total >= 10000) accion = `Retener:  $${(total * 0.07).toFixed(2)}`;

    const card = document.createElement("div");
    card.className = "card mb-2 shadow-sm";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Mes: ${mes}</h5>
        <p class="card-text">Total: $${total.toFixed(2)} (${accion})</p>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
});

// Resetear facturas
resetButton.addEventListener("click", () => {
  facturas = [];
  localStorage.removeItem("facturas");
  mostrarFacturas();
  resultsDiv.innerHTML = `
    <p class="text-success text-center">Facturas reseteadas con éxito.</p>`;
});

mostrarFacturas();
