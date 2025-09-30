import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.js";
import comprasRouter from "./routes/compras.js";
import ventasRouter from "./routes/ventas.js";
import generosRouter from "./routes/generos.js";
import marcasRouter from "./routes/marcas.js";

const app = express();

// ✅ CORS dinámico: refleja el origen que venga en la petición
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || "*");
  },
  credentials: true
}));

app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ API Inventario Tenis funcionando en Express");
});

// Rutas
app.use("/api/productos", productosRouter);
app.use("/api/compras", comprasRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/generos", generosRouter);
app.use("/api/marcas", marcasRouter);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
