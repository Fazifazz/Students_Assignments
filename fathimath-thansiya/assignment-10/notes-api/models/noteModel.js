const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is Required"],
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ["General", "Work", "Personal", "Ideas"],
    },
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
