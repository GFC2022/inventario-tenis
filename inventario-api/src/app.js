import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API Inventario funcionando en Express");
});

app.use("/api/productos", productosRouter);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
