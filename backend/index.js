const express = require("express");
const cors = require("cors");
const { conectarDB } = require("./models/conexion");
const rutas = require("./routes/biblioteca.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", rutas);

conectarDB().then(() => {
  app.listen(3001, () => console.log("🚀 Servidor corriendo en http://localhost:3001"));
});
