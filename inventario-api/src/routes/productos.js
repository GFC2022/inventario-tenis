import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ define primero la ruta
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.codigo_barra, p.nombre, p.talla, p.stock, p.precio,
             m.nombre AS marca, g.nombre AS genero
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN generos g ON p.genero_id = g.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en /api/productos:", err);  // imprime el objeto completo
    res.status(500).json({
      error: err.message || JSON.stringify(err) || "Error desconocido"});
  }
});

// POST /api/productos → insertar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { codigo_barra, nombre, marca_id, genero_id, talla, precio, stock } = req.body;

    if (!codigo_barra || !nombre || !marca_id || !genero_id || !talla || !precio) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO productos (codigo_barra, nombre, marca_id, genero_id, talla, precio, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [codigo_barra, nombre, marca_id, genero_id, talla, precio, stock || 0]
    );

    res.status(201).json({
      id: result.insertId,
      mensaje: "✅ Producto agregado correctamente"
    });

  } catch (err) {
    console.error("❌ Error en POST /api/productos:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});


// ✅ exporta al final
export default router;
