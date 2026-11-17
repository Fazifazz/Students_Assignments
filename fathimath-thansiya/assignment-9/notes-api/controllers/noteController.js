const Note = require("../models/noteModel");

//Get all notes
const getAllNotes = (req, res) => {
  const notes = Note.getAll();
  res.status(200).json({ success: true, count: notes.length, data: notes });
};

//Get note by id
const getNoteById = (req, res) => {
  const { id } = req.params;
  const note = Note.getById(id);
  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }
  res.status(200).json({ success: true, data: note });
};

//Create a new note
const createNote = (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, content and category",
    });
  }
  const newNote = Note.create({ title, content, category });
  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: newNote,
  });
};

//Update a note by id
const updateNote = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedNote = Note.update(id, updatedData);
  if (!updatedNote) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }
  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: updatedNote,
  });
};

//Delete a note by id
const deleteNote = (req, res) => {
  const { id } = req.params;
  const deletedNote = Note.remove(id);
  if (!deletedNote) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }
  res
    .status(200)
    .json({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
    });
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
