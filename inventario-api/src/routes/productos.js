import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Endpoint de prueba: obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
