const { sql, poolPromise } = require('../config');

// ✅ POST - Add OrderItem
const addOrderItem = async (req, res) => {
  try {
    const { orderId, menuId, quantity, notes } = req.body;

    if (!orderId || !menuId || !quantity) {
      return res.status(400).json({ error: "orderId, menuId, and quantity are required" });
    }

    const pool = await poolPromise;

    // Optionally: check if orderId exists
    const orderCheck = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query('SELECT id FROM [dbo].[Orders] WHERE id=@orderId');

    if (orderCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid orderId: Order does not exist" });
    }

    // Optionally: check if menuId exists
    const menuCheck = await pool.request()
      .input('menuId', sql.Int, menuId)
      .query('SELECT id FROM [dbo].[Products] WHERE id=@menuId');

    if (menuCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid menuId: Product does not exist" });
    }

    const result = await pool.request()
      .input('orderId', sql.Int, orderId)
      .input('menuId', sql.Int, menuId)
      .input('quantity', sql.Int, quantity)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        INSERT INTO [dbo].[OrderItems] ([orderId],[menuId],[quantity],[notes])
        OUTPUT INSERTED.id
        VALUES (@orderId,@menuId,@quantity,@notes)
      `);

    res.status(201).json({ message: "OrderItem added", id: result.recordset[0].id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET - All OrderItems
const getOrderItems = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM [dbo].[OrderItems] ORDER BY id DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT - Update OrderItem
const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderId, menuId, quantity, notes } = req.body;

    const pool = await poolPromise;

    // Check if item exists
    const itemCheck = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM [dbo].[OrderItems] WHERE id=@id');

    if (itemCheck.recordset.length === 0) {
      return res.status(404).json({ error: "OrderItem not found" });
    }

    // Optional: validate orderId and menuId
    const orderCheck = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query('SELECT id FROM [dbo].[Orders] WHERE id=@orderId');

    if (orderCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid orderId: Order does not exist" });
    }

    const menuCheck = await pool.request()
      .input('menuId', sql.Int, menuId)
      .query('SELECT id FROM [dbo].[Products] WHERE id=@menuId');

    if (menuCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid menuId: Product does not exist" });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('orderId', sql.Int, orderId)
      .input('menuId', sql.Int, menuId)
      .input('quantity', sql.Int, quantity)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        UPDATE [dbo].[OrderItems]
        SET orderId=@orderId, menuId=@menuId, quantity=@quantity, notes=@notes
        WHERE id=@id
      `);

    res.json({ message: "OrderItem updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE - Remove OrderItem
const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM [dbo].[OrderItems] WHERE id=@id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "OrderItem not found" });
    }

    res.json({ message: "OrderItem deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem
};
