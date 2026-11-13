const express = require("express");

const router = express.Router();

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

// GET all notes
router.get("/", getAllNotes);

// GET note by ID
router.get("/:id", getNoteById);

// POST new note
router.post("/", createNote);

// PUT update note
router.put("/:id", updateNote);

// DELETE note
router.delete("/:id", deleteNote);

module.exports = router;
