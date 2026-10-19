// Usage (from the backend folder):
//   node scripts/create-admin.js admin@example.com "YourStrongPassword" "Admin Name"
// Creates an admin user (or promotes/updates it if the email already exists).
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config');

(async () => {
  const [email, password, username = 'Admin'] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
    process.exit(1);
  }
  try {
    const pool = await poolPromise;
    const hash = await bcrypt.hash(password, 10);
    const existing = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM [dbo].[Users] WHERE email=@email');

    if (existing.recordset.length) {
      await pool.request()
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hash)
        .query("UPDATE [dbo].[Users] SET password=@password, role='admin' WHERE email=@email");
      console.log('Updated existing user and set role = admin');
    } else {
      await pool.request()
        .input('username', sql.NVarChar, username)
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hash)
        .query(`INSERT INTO [dbo].[Users] ([username],[email],[password],[role],[createdAt])
                VALUES (@username,@email,@password,'admin',GETDATE())`);
      console.log('Admin user created');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
