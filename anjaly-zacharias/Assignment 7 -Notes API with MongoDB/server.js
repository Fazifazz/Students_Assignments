
// Import packages
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Note Model
const Note = require('./models/Note');

// Create Express application
const app = express();

// Middleware
app.use(express.json());


// 1. GET ALL NOTES
app.get('/api/notes', async (req, res) => {
    try {

        // Category filter
        const filter = {};

        if (req.query.category) { 
            filter.category = req.query.category;
        }

        const notes = await Note.find(filter);

        res.status(200).json(notes);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
});


// 2. GET NOTE BY ID
app.get('/api/notes/:id', async (req, res) => {
    try {

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json(note);

    } catch (error) {

        if (error.name === 'CastError') {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
});


// 3. CREATE NEW NOTE
app.post('/api/notes', async (req, res) => {
    try {

        const note = new Note(req.body);

        const savedNote = await note.save();

        res.status(201).json(savedNote);

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
});


// 4. UPDATE NOTE
app.put('/api/notes/:id', async (req, res) => {
    try {

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json(updatedNote);

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                error: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
});


// 5. DELETE NOTE
app.delete('/api/notes/:id', async (req, res) => {
    try {

        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json({
            message: 'Note deleted successfully',
            deletedNote
        });

    } catch (error) {

        if (error.name === 'CastError') {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
});


// Connect to MongoDB and Start Server
const startServer = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected Successfully!');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);

    }
};

startServer();
