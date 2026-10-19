const { sql, poolPromise } = require('../config');

// ✅ POST - Add Product with category check
const addProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: "Name, price, and categoryId are required" });
    }

    const pool = await poolPromise;

    // Check if category exists
    const categoryCheck = await pool.request()
      .input('categoryId', sql.Int, categoryId)
      .query(`SELECT * FROM [dbo].[Categories] WHERE id = @categoryId`);

    if (categoryCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid categoryId: Category does not exist" });
    }

    // Insert product
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .input('price', sql.Decimal(10, 2), price)
      .input('categoryId', sql.Int, categoryId)
      .input('imageUrl', sql.NVarChar, imageUrl || null) // 👈 أضفنا الصورة
      .query(`
        INSERT INTO [dbo].[Products] ([name], [description], [price], [categoryId], [imageUrl], [createdAt])
        VALUES (@name, @description, @price, @categoryId, @imageUrl, GETDATE())
      `);

    const result = await pool.request().query(`SELECT SCOPE_IDENTITY() AS id`);
    res.status(201).json({ message: "Product added", id: result.recordset[0].id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET - All Products
const getProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM [dbo].[Products] ORDER BY createdAt DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT - Update Product with category check
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: "Name, price, and categoryId are required" });
    }

    const pool = await poolPromise;

    // Check if product exists
    const productCheck = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM [dbo].[Products] WHERE id = @id`);

    if (productCheck.recordset.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if category exists
    const categoryCheck = await pool.request()
      .input('categoryId', sql.Int, categoryId)
      .query(`SELECT * FROM [dbo].[Categories] WHERE id = @categoryId`);

    if (categoryCheck.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid categoryId: Category does not exist" });
    }

    // Update product
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .input('price', sql.Decimal(10, 2), price)
      .input('categoryId', sql.Int, categoryId)
      .input('imageUrl', sql.NVarChar, imageUrl || null) // 👈 أضفنا الصورة
      .query(`
        UPDATE [dbo].[Products]
        SET [name]=@name, [description]=@description, [price]=@price, [categoryId]=@categoryId, [imageUrl]=@imageUrl
        WHERE [id]=@id
      `);

    res.json({ message: "Product updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE - Remove Product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM [dbo].[Products] WHERE [id]=@id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
