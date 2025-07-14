# 📚 Sistema de Gestión de Biblioteca Digital

Proyecto Fullstack desarrollado con **Node.js**, **Express**, **MongoDB** y **Frontend Vanilla JS + Tailwind CSS**.  
Permite la gestión de libros, préstamos, devoluciones y reportes en una biblioteca digital.

---

## ✨ Funcionalidades Implementadas

- ✅ **Agregar libro** al catálogo con título, autor, ISBN, género, año y cantidad de copias.
- ✅ **Buscar libros** por título, autor o género.
- ✅ **Registrar préstamo** de libros si hay copias disponibles.
- ✅ **Registrar devolución** de libros y actualizar disponibilidad.
- ✅ **Visualizar préstamos activos**.
- ✅ **Generar reporte** de los 5 libros más prestados.

---

## 📝 Estructura de la Base de Datos (MongoDB)

### 📘 Colección: `libros`
```json
{
  "_id": ObjectId,
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "isbn": "978-0307389732",
  "genero": "Realismo mágico",
  "anioPublicacion": 1967,
  "copias": 3,
  "disponibles": 2
} 
```

📝 Colección: prestamos

``` {
  "_id": ObjectId,
  "libroId": ObjectId,
  "usuario": "Juan Pérez",
  "fechaPrestamo": ISODate,
  "fechaDevolucion": ISODate,
  "devuelto": false
}
```

🚀 Tecnologías Utilizadas
	•	Backend: Node.js + Express
	•	Base de datos: MongoDB (conexión nativa)
	•	Frontend: HTML5,Tailwind y JavaScript
	•	Dependencias: mongodb, express, cors

🛠️ ¿Cómo ejecutar el proyecto?
1.	Clonar el repositorio:
``` 
git clone https://github.com/Kloster96/Proyecto_BaseDeDatos_2.git 
```

2.	Instalar dependencias backend:
```
cd backend
npm install
```

3.	Iniciar MongoDB localmente.

4.	Correr el servidor:
```npm run dev```

5.	Abrir el archivo index.html desde /frontend en el navegador.
(Puedes usar Liveserver)

👤 Autor

Luciano Kloster
Proyecto académico - UTN




