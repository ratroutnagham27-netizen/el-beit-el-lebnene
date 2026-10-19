const { sql, poolPromise } = require('../config');
const bcrypt = require('bcryptjs');

// ✅ POST - Add User
const addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Public sign-up can only create normal users; admins are created with scripts/create-admin.js
    const role = 'user';

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const pool = await poolPromise;

    // Check if email already exists
    const emailCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM [dbo].[Users] WHERE email=@email');

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO [dbo].[Users] ([username],[email],[password],[role],[createdAt])
        VALUES (@username,@email,@password,@role,GETDATE())
      `);

    const result = await pool.request().query('SELECT SCOPE_IDENTITY() AS id');
    res.status(201).json({ message: "User added", id: result.recordset[0].id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET - All Users
const getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, username, email, role, createdAt FROM [dbo].[Users] ORDER BY createdAt DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT - Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const pool = await poolPromise;

    // Check if user exists
    const userCheck = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM [dbo].[Users] WHERE id=@id');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // If password is provided, hash it
    const hashedPassword = password ? await bcrypt.hash(password, 10) : userCheck.recordset[0].password;

    await pool.request()
      .input('id', sql.Int, id)
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role)
      .query(`
        UPDATE [dbo].[Users]
        SET username=@username, email=@email, password=@password, role=@role
        WHERE id=@id
      `);

    res.json({ message: "User updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE - Remove User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM [dbo].[Users] WHERE id=@id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addUser,
  getUsers,
  updateUser,
  deleteUser
};
