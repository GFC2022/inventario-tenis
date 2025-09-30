import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * GET /api/marcas
 * Listar todas las marcas
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM marcas ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/marcas:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * POST /api/marcas
 * Crear una nueva marca
 */
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    }

    const [result] = await pool.query(
      "INSERT INTO marcas (nombre) VALUES (?)",
      [nombre]
    );

    res.status(201).json({
      id: result.insertId,
      mensaje: "✅ Marca agregada correctamente"
    });
  } catch (err) {
    console.error("❌ Error en POST /api/marcas:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * PUT /api/marcas/:id
 * Actualizar una marca
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE marcas SET nombre=? WHERE id=?",
      [nombre, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    res.json({ mensaje: "✅ Marca actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error en PUT /api/marcas/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * DELETE /api/marcas/:id
 * Eliminar una marca
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM marcas WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Marca no encontrada" });
    }

    res.json({ mensaje: "✅ Marca eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error en DELETE /api/marcas/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

export default router;
