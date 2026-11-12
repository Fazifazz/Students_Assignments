require('dotenv').config();
const express = require('express');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount the Notes router
app.use('/api/notes', noteRoutes);

// Root test route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Notes REST API (Assignment 6)'
  });
});

// 404 Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
