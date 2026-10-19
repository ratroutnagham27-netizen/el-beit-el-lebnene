const { sql, poolPromise } = require('../config');

// ✅ POST - Add Category (مع الصورة)
const addCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        INSERT INTO [dbo].[Categories] ([name], [imageUrl], [createdAt])
        VALUES (@name, @imageUrl, GETDATE());
        SELECT SCOPE_IDENTITY() AS id;
      `);

    res.status(201).json({ message: "Category added", id: result.recordset[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET - All Categories (مع الصورة)
const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM [dbo].[Categories] ORDER BY createdAt DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT - Update Category by ID (مع الصورة)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        UPDATE [dbo].[Categories]
        SET [name] = @name,
            [imageUrl] = @imageUrl
        WHERE [id] = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE - Remove Category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM [dbo].[Categories] WHERE [id] = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
