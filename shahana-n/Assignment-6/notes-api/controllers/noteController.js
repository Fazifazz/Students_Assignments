
const Note = require('../models/Note');

// GET all notes
const getAllNotes = async (req, res, next) => {
  try {
    const notes = Note.getAll();

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    next(err);
  }
};

// GET note by ID
const getNoteById = async (req, res, next) => {
  try {
    const note =  Note.getById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    next(err);
  }
};

// POST create note
const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and category are required'
      });
    }

    const newNote =  Note.create({
      title,
      content,
      category
    });

    res.status(201).json({
      success: true,
      message: 'Note created',
      data: newNote
    });
  } catch (err) {
    next(err);
  }
};

// PUT update note
const updateNote = async (req, res, next) => {
  try {
    const updated =  Note.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// DELETE note
const deleteNote = async (req, res, next) => {
  try {
    const deleted = Note.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted',
      data: deleted
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
