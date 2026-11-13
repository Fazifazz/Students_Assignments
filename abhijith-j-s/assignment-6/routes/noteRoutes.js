// routes/noteRoutes.js
// Only maps URL + HTTP method -> controller function. No logic here.

const express = require('express');
const router = express.Router();

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// Base path is /api/notes (set in index.js)
router.get('/', getAllNotes);        // GET    /api/notes
router.get('/:id', getNoteById);     // GET    /api/notes/:id
router.post('/', createNote);        // POST   /api/notes
router.put('/:id', updateNote);      // PUT    /api/notes/:id
router.delete('/:id', deleteNote);   // DELETE /api/notes/:id

module.exports = router;
