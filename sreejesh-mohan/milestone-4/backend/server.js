require('dotenv').config();
const express = require('express');

const equipmentRoutes = require('./routes/equipment');
const rentalRoutes = require('./routes/rentals');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware (Native without external module - Session 43 & 45)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON Body Parser Middleware (Session 45)
app.use(express.json());

// Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/rentals', rentalRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'EquipTrack REST API is running smoothly', status: 'ok' });
});

// 404 Catch-All Middleware (Session 45)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

app.listen(PORT, () => {
  console.log(`EquipTrack Server running on http://localhost:${PORT}`);
});
