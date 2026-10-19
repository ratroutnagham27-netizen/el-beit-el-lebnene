const { sql, poolPromise } = require('../config');

// ✅ POST - Add Order
const addOrder = async (req, res) => {
  try {
    const { fullName, address, area, phone, totalPrice, promoCode } = req.body;

    if (!fullName || !address || !area || !phone || totalPrice === undefined) {
      return res.status(400).json({ error: "fullName, address, area, phone, and totalPrice are required" });
    }

    const pool = await poolPromise;

    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('address', sql.NVarChar, address)
      .input('area', sql.NVarChar, area)
      .input('phone', sql.NVarChar, phone)
      .input('totalPrice', sql.Decimal(10, 2), totalPrice)
      .input('promoCode', sql.NVarChar, promoCode || null)
      .query(`
        INSERT INTO [dbo].[Orders] ([fullName],[address],[area],[phone],[totalPrice],[promoCode],[createdAt])
        OUTPUT INSERTED.id
        VALUES (@fullName,@address,@area,@phone,@totalPrice,@promoCode,GETDATE())
      `);

    res.status(201).json({ message: "Order added", id: result.recordset[0].id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET - All Orders
const getOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM [dbo].[Orders] ORDER BY createdAt DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// GET - Order details with items
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const orderResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM [dbo].[Orders] WHERE id=@id`);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsResult = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          oi.id,
          oi.orderId,
          oi.menuId,
          oi.quantity,
          oi.notes,
          p.name AS productName,
          p.price AS productPrice,
          (p.price * oi.quantity) AS lineTotal
        FROM [dbo].[OrderItems] oi
        LEFT JOIN [dbo].[Products] p ON oi.menuId = p.id
        WHERE oi.orderId=@orderId
        ORDER BY oi.id ASC
      `);

    res.json({
      order: orderResult.recordset[0],
      items: itemsResult.recordset,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT - Update Order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, address, area, phone, totalPrice, promoCode } = req.body;

    const pool = await poolPromise;

    // Check if order exists
    const orderCheck = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM [dbo].[Orders] WHERE id=@id`);

    if (orderCheck.recordset.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('fullName', sql.NVarChar, fullName)
      .input('address', sql.NVarChar, address)
      .input('area', sql.NVarChar, area)
      .input('phone', sql.NVarChar, phone)
      .input('totalPrice', sql.Decimal(10, 2), totalPrice)
      .input('promoCode', sql.NVarChar, promoCode || null)
      .query(`
        UPDATE [dbo].[Orders]
        SET fullName=@fullName, address=@address, area=@area, phone=@phone, totalPrice=@totalPrice, promoCode=@promoCode
        WHERE id=@id
      `);

    res.json({ message: "Order updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE - Remove Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const orderCheck = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT id FROM [dbo].[Orders] WHERE id=@id`);

    if (orderCheck.recordset.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM [dbo].[OrderItems] WHERE orderId=@id`);

    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM [dbo].[Orders] WHERE id=@id`);

    res.json({ message: "Order deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderDetails,
  updateOrder,
  deleteOrder
};
