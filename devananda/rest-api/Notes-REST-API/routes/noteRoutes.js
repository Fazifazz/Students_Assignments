const express = require('express');

const router = express.Router();

const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

router.get('/notes', getNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', createNote);
router.put('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);

module.exports = router;