
const Note = require('../models/Note');

// GET all notes
const getAllNotes = (req, res) => {
  res.status(200).json(Note.getAll());
};

// GET note by ID
const getNoteById = (req, res) => {
  const note = Note.getById(req.params.id);

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
};

// POST create note
const createNote = (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: 'Title, content and category are required'
    });
  }

  const newNote = Note.create({
    title,
    content,
    category
  });

  res.status(201).json({
    success: true,
    message: 'Note created',
    data: newNote
  });
};

// PUT update note
const updateNote = (req, res) => {
  const updated = Note.update(req.params.id, req.body);

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
};

// DELETE note
const deleteNote = (req, res) => {
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
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
