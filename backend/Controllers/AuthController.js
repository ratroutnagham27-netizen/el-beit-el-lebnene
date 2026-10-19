const { sql, poolPromise } = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// POST /Admin/auth/login  { email, password }
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, username, email, password, role FROM [dbo].[Users] WHERE email=@email');

    const user = result.recordset[0];
    // Same message for "no such user" and "wrong password"
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };
