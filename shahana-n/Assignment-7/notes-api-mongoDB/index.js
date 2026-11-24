require('dotenv').config();
const mongoose = require('mongoose');

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

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error);
    });