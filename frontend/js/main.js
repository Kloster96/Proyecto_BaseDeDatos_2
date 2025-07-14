import {
  agregarLibro,
  obtenerLibros,
  prestarLibro,
  buscarLibros,
  obtenerPrestamosActivos,
  devolverLibroPorId,
  obtenerReportePopulares,
} from "./api.js";

const formLibro = document.getElementById("form-libro");
const formPrestar = document.getElementById("form-prestar");
const listaLibros = document.getElementById("lista-libros");
const listaPrestamos = document.getElementById("lista-prestamos");
const busqueda = document.getElementById("busqueda");
const mensajePrestar = document.getElementById("mensaje-prestar");
const listaReporte = document.getElementById("lista-reporte");

async function renderLibros(query = "") {
  let libros = [];
  if (query) {
    libros = await buscarLibros(query);
  } else {
    libros = await obtenerLibros();
  }

  if (libros.length === 0) {
    listaLibros.innerHTML = `<tr><td colspan="6" class="py-4 text-gray-500">No se encontraron libros.</td></tr>`;
    return;
  }

  listaLibros.innerHTML = libros
    .map(
      (libro) => `
      <tr class="border-b hover:bg-gray-100">
        <td class="py-2 px-4 border-r">${libro.titulo}</td>
        <td class="py-2 px-4 border-r">${libro.autor}</td>
        <td class="py-2 px-4 border-r">${libro.isbn}</td>
        <td class="py-2 px-4 border-r">${libro.anioPublicacion}</td>
        <td class="py-2 px-4 border-r">${libro.copias}</td>
        <td class="py-2 px-4">${libro.disponibles}</td>
      </tr>
    `
    )
    .join("");
}

async function renderPrestamos() {
  const prestamos = await obtenerPrestamosActivos();

  if (!prestamos.length) {
    listaPrestamos.innerHTML = `<tr><td colspan="4" class="py-4 text-gray-500">No hay préstamos activos.</td></tr>`;
    return;
  }

  listaPrestamos.innerHTML = prestamos
    .map(
      (p) => `
      <tr class="border-b hover:bg-gray-100">
        <td class="py-2 px-4 border-r">${p.usuario}</td>
        <td class="py-2 px-4 border-r">${p.libroTitulo}</td>
        <td class="py-2 px-4 border-r">${new Date(p.fechaPrestamo).toLocaleDateString()}</td>
        <td class="py-2 px-4">
          <button onclick="devolver('${p._id}')" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Devolver
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

// Función global para devolución de libros
window.devolver = async function (id) {
  try {
    await devolverLibroPorId(id);
    await renderLibros();
    await renderPrestamos();
    await renderReportePopulares();
  } catch (err) {
    alert("Error al devolver el libro.");
  }
};

formLibro.onsubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formLibro));
  data.copias = parseInt(data.copias);
  data.disponibles = data.copias;
  data.anioPublicacion = parseInt(data.anioPublicacion);

  await agregarLibro(data);
  formLibro.reset();
  renderLibros();
  renderReportePopulares();
};

formPrestar.onsubmit = async (e) => {
  e.preventDefault();
  mensajePrestar.textContent = "";
  const data = Object.fromEntries(new FormData(formPrestar));

  try {
    await prestarLibro(data);
    mensajePrestar.textContent = "Préstamo registrado con éxito.";
    mensajePrestar.className = "mt-2 text-green-600 font-semibold";
    formPrestar.reset();
    renderLibros();
    renderPrestamos();
    renderReportePopulares();
  } catch (error) {
    mensajePrestar.textContent =
      error.message || "Error al registrar préstamo.";
    mensajePrestar.className = "mt-2 text-red-600 font-semibold";
  }
};

busqueda.oninput = () => {
  const q = busqueda.value.trim();
  renderLibros(q);
};

async function renderReportePopulares() {
  try {
    const populares = await obtenerReportePopulares();

    if (populares.length === 0) {
      listaReporte.innerHTML = `<tr><td colspan="3" class="py-4 text-gray-500 text-center">No hay datos de libros populares.</td></tr>`;
      return;
    }

    listaReporte.innerHTML = populares
      .map(
        (libro) => `
      <tr class="border-b hover:bg-gray-100">
        <td class="py-2 px-4 border-r">${libro.titulo}</td>
        <td class="py-2 px-4 border-r">${libro.autor}</td>
        <td class="py-2 px-4">${libro.cantidad}</td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    listaReporte.innerHTML = `<tr><td colspan="3" class="py-4 text-red-600 text-center">Error al cargar el reporte.</td></tr>`;
  }
}

renderLibros();
renderPrestamos();
renderReportePopulares();
