import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * POST /api/ventas
 * Registrar una nueva venta con productos (resta stock).
 * Body esperado:
 * {
 *   "productos": [
 *     { "producto_id": 1, "cantidad": 2, "precio_unitario": 1500 },
 *     { "producto_id": 2, "cantidad": 1, "precio_unitario": 1800 }
 *   ]
 * }
 */
router.post("/", async (req, res) => {
  const { productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: "Debe incluir al menos un producto" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar venta inicial con total=0
    const [ventaResult] = await conn.query(
      "INSERT INTO ventas (total) VALUES (0)"
    );
    const ventaId = ventaResult.insertId;

    let total = 0;

    for (const item of productos) {
      const subtotal = item.cantidad * item.precio_unitario;
      total += subtotal;

      // Insertar detalle
      await conn.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [ventaId, item.producto_id, item.cantidad, item.precio_unitario]
      );

      // Restar stock (solo si hay suficiente)
      const [updateResult] = await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.cantidad, item.producto_id, item.cantidad]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(
          `Stock insuficiente para el producto con id ${item.producto_id}`
        );
      }
    }

    // Actualizar total
    await conn.query("UPDATE ventas SET total=? WHERE id=?", [total, ventaId]);

    await conn.commit();

    res.status(201).json({
      id: ventaId,
      mensaje: "✅ Venta registrada correctamente",
      total
    });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error en POST /api/ventas:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  } finally {
    conn.release();
  }
});

/**
 * GET /api/ventas
 * Listar todas las ventas
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ventas ORDER BY fecha DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error en GET /api/ventas:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * GET /api/ventas/:id
 * Obtener detalle de una venta
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [venta] = await pool.query("SELECT * FROM ventas WHERE id=?", [id]);
    if (venta.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const [detalle] = await pool.query(
      `SELECT d.id, d.cantidad, d.precio_unitario, 
              p.nombre AS producto, p.codigo_barra
       FROM detalle_ventas d
       INNER JOIN productos p ON d.producto_id = p.id
       WHERE d.venta_id = ?`,
      [id]
    );

    res.json({
      ...venta[0],
      productos: detalle
    });
  } catch (err) {
    console.error("❌ Error en GET /api/ventas/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  }
});

/**
 * DELETE /api/ventas/:id
 * Cancelar una venta: revertir stock y eliminar venta + detalle
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Obtener detalle de la venta
    const [detalle] = await conn.query(
      "SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = ?",
      [id]
    );

    if (detalle.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Venta no encontrada o sin detalle" });
    }

    // Revertir stock
    for (const item of detalle) {
      await conn.query(
        "UPDATE productos SET stock = stock + ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    // Eliminar detalle
    await conn.query("DELETE FROM detalle_ventas WHERE venta_id = ?", [id]);

    // Eliminar venta
    await conn.query("DELETE FROM ventas WHERE id = ?", [id]);

    await conn.commit();

    res.json({ mensaje: "✅ Venta cancelada y stock revertido" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error en DELETE /api/ventas/:id:", err);
    res.status(500).json({ error: err.message || "Error desconocido" });
  } finally {
    conn.release();
  }
});

export default router;
