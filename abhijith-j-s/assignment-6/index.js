// index.js
// Entry point: creates the Express app, adds middleware, mounts routes, starts the server.

const express = require('express');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: lets Express read JSON sent in the request body (req.body)
app.use(express.json());

// Simple welcome route (handy for checking the server is up)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Notes REST API is running',
    endpoints: '/api/notes',
  });
});

// All note routes live under /api/notes
app.use('/api/notes', noteRoutes);

// 404 handler: runs when no route above matched
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error handler: catches errors such as malformed JSON in the request body
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
