require('dotenv').config();

const express = require('express');

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());

// Custom middleware
app.use(logger);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Express API running' });
});

app.use('/api/notes', noteRoutes);

// Error middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
});