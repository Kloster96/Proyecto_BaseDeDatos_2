const express = require("express");
const router = express.Router();
const controlador = require("../controllers/biblioteca.controller");

router.post("/libros", controlador.agregarLibro);
router.get("/libros", controlador.buscarLibros);
router.post("/prestamo", controlador.prestarLibro);
router.put("/devolver/:id", controlador.devolverLibro);
router.get("/prestamos", controlador.obtenerPrestamosActivos);
router.get("/reporte", controlador.reportePopulares);

module.exports = router;
