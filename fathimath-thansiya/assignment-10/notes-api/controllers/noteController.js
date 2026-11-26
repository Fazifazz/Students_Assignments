const Note = require("../models/noteModel");

//Get all notes
const getAllNotes = async (req, res, next) => {
  try {
    const allowedCategories = ["General", "Work", "Personal", "Ideas"];
    const category = req.query.category;

    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const filter = category ? { category } : {};
    const notes = await Note.find(filter);
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    next(err);
  }
};

//Get note by id
const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

//Create a new note
const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    const newNote = new Note({ title, content, category });
    await newNote.save();
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (err) {
    next(err);
  }
};

//Update a note by id
const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedNote = await Note.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (err) {
    next(err);
  }
};

//Delete a note by id
const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
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
  deleteNote,
};
