import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// POST /api/compras → registrar una compra con productos
router.post("/", async (req, res) => {
  const { proveedor, productos } = req.body;
  // productos es un array [{ producto_id, cantidad, precio_unitario }]

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar compra
    const [compraResult] = await conn.query(
      "INSERT INTO compras (proveedor) VALUES (?)",
      [proveedor]
    );
    const compraId = compraResult.insertId;

    let total = 0;

    // Insertar detalle y actualizar stock
    for (const item of productos) {
      const subtotal = item.cantidad * item.precio_unitario;
      total += subtotal;

      await conn.query(
        `INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [compraId, item.producto_id, item.cantidad, item.precio_unitario]
      );

      await conn.query(
        `UPDATE productos SET stock = stock + ? WHERE id = ?`,
        [item.cantidad, item.producto_id]
      );
    }

    // Actualizar total
    await conn.query("UPDATE compras SET total=? WHERE id=?", [total, compraId]);

    await conn.commit();

    res.status(201).json({
      id: compraId,
      mensaje: "✅ Compra registrada correctamente",
      total
    });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error en POST /api/compras:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  } finally {
    conn.release();
  }
});

// GET /api/compras → listar compras
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compras ORDER BY fecha DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/compras:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

// GET /api/compras/:id → obtener detalle de una compra
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener encabezado de la compra
    const [compra] = await pool.query("SELECT * FROM compras WHERE id = ?", [id]);

    if (compra.length === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    // Obtener detalle con productos
    const [detalle] = await pool.query(
      `SELECT d.id, d.cantidad, d.precio_unitario, 
              p.nombre AS producto, p.codigo_barra
       FROM detalle_compras d
       INNER JOIN productos p ON d.producto_id = p.id
       WHERE d.compra_id = ?`,
      [id]
    );

    res.json({
      ...compra[0],       // datos de la compra
      productos: detalle  // lista de productos
    });

  } catch (err) {
    console.error("❌ Error en GET /api/compras/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});


export default router;
