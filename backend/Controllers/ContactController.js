const { sql, poolPromise } = require('../config');

const ensureContactMessagesTable = async (pool) => {
  await pool.request().query(`
    IF OBJECT_ID('[dbo].[ContactMessages]', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[ContactMessages] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME DEFAULT GETDATE()
      );
    END
  `);
};

// POST - Add contact message
const addContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }

    const pool = await poolPromise;
    await ensureContactMessagesTable(pool);

    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('message', sql.NVarChar, message)
      .query(`
        INSERT INTO [dbo].[ContactMessages] ([name], [email], [message], [createdAt])
        OUTPUT INSERTED.id
        VALUES (@name, @email, @message, GETDATE())
      `);

    res.status(201).json({
      message: 'Contact message saved successfully',
      id: result.recordset[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - All contact messages
const getContactMessages = async (req, res) => {
  try {
    const pool = await poolPromise;
    await ensureContactMessagesTable(pool);

    const result = await pool.request().query(`
      SELECT id, name, email, message, createdAt
      FROM [dbo].[ContactMessages]
      ORDER BY createdAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE - Delete contact message
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Message id is required' });
    }

    const pool = await poolPromise;
    await ensureContactMessagesTable(pool);

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM [dbo].[ContactMessages] WHERE id=@id');

    res.json({ message: 'Contact message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addContactMessage,
  getContactMessages,
  deleteContactMessage,
};
