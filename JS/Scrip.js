const facturas = [];

function Factura(fecha, monto) {
  this.fecha = fecha;
  this.monto = parseFloat(monto);
}

function agregarFactura() {
  const fecha = prompt("Fecha (YYYY-MM-DD):");
  const monto = parseFloat(prompt("Monto:"));
  if (!isNaN(monto) && fecha) {
    facturas.push(new Factura(fecha, monto));
    alert("Factura agregada.");
  } else {
    alert("Datos inválidos.");
  }
}

function filtrarFacturas() {
  const filtro = prompt("Filtrar por mes y año (YYYY-MM):");
  if (!filtro) {
    alert("Formato inválido.");
    return;
  }
  const filtradas = facturas.filter((f) => f.fecha.startsWith(filtro));
  if (filtradas.length === 0) {
    alert("Sin resultados.");
  } else {
    let texto = `Facturas en ${filtro}:\n`;
    filtradas.forEach((f, i) => {
      texto += `${i + 1}. Fecha: ${f.fecha}, Monto: $${f.monto}\n`;
    });
    alert(texto);
  }
}

function procesarFacturas() {
  if (facturas.length === 0) {
    alert("No hay facturas.");
    return;
  }
  const porMes = {};
  facturas.forEach((f) => {
    const mes = f.fecha.slice(0, 7);
    porMes[mes] = (porMes[mes] || 0) + f.monto;
  });

  let mensaje = "Resultados:\n";
  for (const mes in porMes) {
    const total = porMes[mes];
    if (total < 2000) {
      mensaje += `Mes: ${mes}, Total: ${total} (Sin acción)\n`;
    } else if (total < 10000) {
      mensaje += `Mes: ${mes}, Total: ${total} (Informar cliente)\n`;
    } else {
      mensaje += `Mes: ${mes}, Total: ${total} (Retener: $${(
        total * 0.07
      ).toFixed(2)})\n`;
    }
  }
  alert(mensaje);
}

function menu() {
  let op;
  do {
    op = prompt("1. Agregar\n2. Procesar\n3. Filtrar\n4. Salir");
    if (op === "1") agregarFactura();
    else if (op === "2") procesarFacturas();
    else if (op === "3") filtrarFacturas();
  } while (op !== "4");
}

menu();
