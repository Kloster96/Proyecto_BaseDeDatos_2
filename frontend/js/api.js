const API_URL = "http://localhost:3001/api";

export async function agregarLibro(libro) {
  const res = await fetch(`${API_URL}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(libro),
  });
  if (!res.ok) throw new Error("Error al agregar libro");
  return await res.json();
}

export async function obtenerLibros() {
  const res = await fetch(`${API_URL}/libros`);
  if (!res.ok) throw new Error("Error al obtener libros");
  return await res.json();
}

export async function prestarLibro({ isbn, usuario }) {
  const res = await fetch(`${API_URL}/prestamo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isbn, usuario }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al prestar libro");
  }
  return await res.json();
}

export async function buscarLibros(q) {
  const url = new URL(`${API_URL}/libros`);
  if (q) url.searchParams.append("q", q);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al buscar libros");
  return await res.json();
}

export async function obtenerPrestamosActivos() {
  const res = await fetch(`${API_URL}/prestamos?activos=true`);
  if (!res.ok) throw new Error("Error al obtener préstamos");
  return await res.json();
}

export async function devolverLibroPorId(id) {
  const res = await fetch(`${API_URL}/devolver/${id}`, {
    method: "PUT"
  });
  if (!res.ok) throw new Error("Error al devolver libro");
  return await res.json();
}

export async function obtenerReportePopulares() {
  const res = await fetch(`${API_URL}/reporte`);
  if (!res.ok) throw new Error("Error al obtener reporte populares");
  return await res.json();
}
