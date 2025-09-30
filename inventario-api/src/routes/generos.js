import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * GET /api/generos
 * Listar todos los géneros
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM generos ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/generos:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * POST /api/generos
 * Crear un nuevo género
 */
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    }

    const [result] = await pool.query(
      "INSERT INTO generos (nombre) VALUES (?)",
      [nombre]
    );

    res.status(201).json({
      id: result.insertId,
      mensaje: "✅ Género agregado correctamente"
    });
  } catch (err) {
    console.error("❌ Error en POST /api/generos:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * PUT /api/generos/:id
 * Actualizar un género
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE generos SET nombre=? WHERE id=?",
      [nombre, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    res.json({ mensaje: "✅ Género actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error en PUT /api/generos/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * DELETE /api/generos/:id
 * Eliminar un género
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM generos WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    res.json({ mensaje: "✅ Género eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en DELETE /api/generos/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

export default router;
