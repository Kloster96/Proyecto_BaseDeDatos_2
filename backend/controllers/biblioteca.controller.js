const { getDB } = require("../models/conexion");
const { ObjectId } = require("mongodb");

async function agregarLibro(req, res) {
  try {
    const libro = req.body;
    const db = getDB();
    await db.collection("libros").insertOne(libro);
    res.json({ mensaje: "Libro agregado" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar libro" });
  }
}

async function buscarLibros(req, res) {
  try {
    const { q } = req.query;
    const db = getDB();
    const query = q
      ? {
          $or: [
            { titulo: { $regex: q, $options: "i" } },
            { autor: { $regex: q, $options: "i" } },
            { genero: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const libros = await db.collection("libros").find(query).toArray();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar libros" });
  }
}

async function prestarLibro(req, res) {
  try {
    const { isbn, usuario } = req.body;
    const db = getDB();
    const libro = await db.collection("libros").findOne({ isbn });

    if (!libro || libro.disponibles < 1)
      return res.status(400).json({ error: "No disponible" });

    await db.collection("libros").updateOne(
      { isbn },
      { $inc: { disponibles: -1 } }
    );

    await db.collection("prestamos").insertOne({
      libroId: libro._id,
      usuario,
      fechaPrestamo: new Date(),
      devuelto: false,
    });

    res.json({ mensaje: "Préstamo registrado" });
  } catch (err) {
    res.status(500).json({ error: "Error al prestar libro" });
  }
}

async function devolverLibro(req, res) {
  try {
    const { id } = req.params;
    const db = getDB();
    const prestamo = await db
      .collection("prestamos")
      .findOne({ _id: new ObjectId(id) });

    if (!prestamo || prestamo.devuelto)
      return res.status(400).json({ error: "Préstamo no válido" });

    await db.collection("prestamos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          devuelto: true,
          fechaDevolucion: new Date(),
        },
      }
    );

    await db
      .collection("libros")
      .updateOne({ _id: prestamo.libroId }, { $inc: { disponibles: 1 } });

    res.json({ mensaje: "Libro devuelto" });
  } catch (err) {
    res.status(500).json({ error: "Error al devolver libro" });
  }
}

async function reportePopulares(req, res) {
  try {
    const db = getDB();
    const resultado = await db
      .collection("prestamos")
      .aggregate([
        { $group: { _id: "$libroId", cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "libros",
            localField: "_id",
            foreignField: "_id",
            as: "libro",
          },
        },
        { $unwind: "$libro" },
        {
          $project: {
            titulo: "$libro.titulo",
            autor: "$libro.autor",
            cantidad: 1,
          },
        },
      ])
      .toArray();

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: "Error al generar reporte" });
  }
}

async function obtenerPrestamosActivos(req, res) {
  try {
    const db = getDB();
    const prestamos = await db.collection("prestamos").aggregate([
      { $match: { devuelto: false } },
      {
        $lookup: {
          from: "libros",
          localField: "libroId",
          foreignField: "_id",
          as: "libro"
        }
      },
      { $unwind: "$libro" },
      {
        $project: {
          usuario: 1,
          fechaPrestamo: 1,
          libroTitulo: "$libro.titulo"
        }
      }
    ]).toArray();

    res.json(prestamos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener préstamos activos" });
  }
}


module.exports = {
  agregarLibro,
  buscarLibros,
  prestarLibro,
  devolverLibro,
  reportePopulares,
  obtenerPrestamosActivos,
};
