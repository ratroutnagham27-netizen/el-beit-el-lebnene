require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config');
const AdminRoutes = require('./Routes/AdminRoute'); 
const ProductRoutes = require('./Routes/ProductRoute'); 
const OrderRoutes = require('./Routes/OrderRoute');
const OrderItemsRoutes = require('./Routes/OrderItemsRoute');
const UsersRoutes = require('./Routes/UsersRoute');
const ContactRoutes = require('./Routes/ContactRoute');
const AuthRoutes = require('./Routes/AuthRoute');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Test endpoint
app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 as number');
    res.json({ message: "Server & DB working", result: result.recordset });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Admin routes
app.use('/Admin', AdminRoutes);

app.use('/Admin', ProductRoutes);
app.use('/Admin', OrderRoutes);
app.use('/Admin', OrderItemsRoutes);
app.use('/Admin', UsersRoutes);
app.use('/Admin', ContactRoutes);
app.use('/Admin', AuthRoutes);
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
