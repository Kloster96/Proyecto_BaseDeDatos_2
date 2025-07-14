const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function conectarDB() {
  if (!db) {
    await client.connect();
    db = client.db("biblioteca");
    console.log("✅ Conectado a MongoDB");
  }
  return db;
}

function getDB() {
  if (!db) throw new Error("DB no conectada");
  return db;
}

module.exports = { conectarDB, getDB };
