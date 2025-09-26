import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ API Inventario funcionando en Express");
});

// Rutas
app.use("/api/productos", productosRouter);

// Servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
