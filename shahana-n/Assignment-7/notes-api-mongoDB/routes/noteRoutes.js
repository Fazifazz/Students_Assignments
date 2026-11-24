
const express = require('express');

const router = express.Router();

const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

// GET all notes
router.get('/', getNotes);

// GET note by ID
router.get('/:id', getNoteById);

// POST create note
router.post('/', createNote);

// PUT update note
router.put('/:id', updateNote);

// DELETE note
router.delete('/:id', deleteNote);

module.exports = router;
