const express = require("express");
const router = express.Router();
const notes = require("../data/notes");

// GET /api/notes
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
});

// GET /api/notes/:id
router.get("/:id", (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ success: false, message: "Notes not found" });
  }
  res.status(200).json({ success: true, data: note });
});

// POST /api/notes
router.post("/", (req, res) => {
  // const { name, email, role } = req.body;
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: " title, content and category must be included",
    });
  }
  const newNote = {
    id: notes.length + 1,
    title,
    content,
    category,
  };
  notes.push(newNote);
  res
    .status(201)
    .json({ success: true, message: "New note created", data: newNote });
});

// PUT /api/notes/:id
router.put("/:id", (req, res) => {
  const idx = notes.findIndex((note) => note.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }
  const { title, content, category } = req.body;
  if (title) notes[idx].title = title;
  // update only the fields that were sent
  if (content) notes[idx].content = content;
  if (category) notes[idx].category = category;
  res
    .status(200)
    .json({ success: true, message: "User updated", data: notes[idx] });
});

// DELETE /api/users/:id
router.delete("/:id", (req, res) => {
  const idx = notes.findIndex((note) => note.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Notes not found" });
  }
  const deleted = notes.splice(idx, 1);
  // remove 1 item at position idx
  res
    .status(200)
    .json({ success: true, message: "Note deleted", data: deleted[0] });
});

module.exports = router;
