const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString:
    process.env.DB_CONNECTION_STRING ||
    'Driver={SQL Server};Server=localhost;Database=INTERNSHIP;Trusted_Connection=Yes;'
};

const poolPromise = new sql.ConnectionPool(config).connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config:', err);
    process.exit(1);
  });

module.exports = {
  sql, poolPromise
};