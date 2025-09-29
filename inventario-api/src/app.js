import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.js";
import comprasRouter from "./routes/compras.js";
import ventasRouter from "./routes/ventas.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API Inventario Tenis funcionando en Express");
});

app.use("/api/productos", productosRouter);
app.use("/api/compras", comprasRouter);
app.use("/api/ventas", ventasRouter);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
