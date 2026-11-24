
const Note = require('../models/Note');

// GET all notes (if categoty exists, filter by category)
const getNotes = async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const notes = await Note.find(filter);

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

// GET note by ID
const getNoteById = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// CREATE note
const createNote = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;

        const note = new Note({
            title,
            content,
            category
        });

        await note.save();

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE note
const updateNote = async (req, res, next) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// DELETE note
const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            const error = new Error('Note not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
            data: note
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
