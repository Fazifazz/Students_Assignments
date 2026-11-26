const Note = require('../models/Note');

const categories = ['General', 'Work', 'Personal', 'Ideas'];

function handleError(res, error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(404).json({ message: 'Note not found' });
  }

  console.error('Notes API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}

async function getNotes(req, res) {
  try {
    const filter = {};
    if (req.query.category !== undefined) {
      if (!categories.includes(req.query.category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      filter.category = req.query.category;
    }

    const notes = await Note.find(filter);
    return res.json(notes);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json(note);
  } catch (error) {
    return handleError(res, error);
  }
}

async function createNote(req, res) {
  try {
    const { title, content, category } = req.body || {};
    const note = new Note({ title, content, category });
    await note.save();
    return res.status(201).json(note);
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateNote(req, res) {
  try {
    const { title, content, category } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;

    const note = await Note.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json(note);
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
