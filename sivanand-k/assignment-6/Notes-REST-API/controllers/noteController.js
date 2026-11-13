// Initial notes (In-memory array)
let notes = [
  {
    id: 1,
    title: "Learning JavaScript",
    content: "Practice JavaScript every day",
    category: "Education",
  },
  {
    id: 2,
    title: "Complete Assignment",
    content: "Finish Express REST API assignment",
    category: "Work",
  },
  {
    id: 3,
    title: "Buy Groceries",
    content: "Buy vegetables and fruits",
    category: "Personal",
  },
];

// GET all notes
const getAllNotes = (req, res) => {
  res.status(200).json(notes);
};

// GET note by ID
const getNoteById = (req, res) => {
  const id = Number(req.params.id);

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  res.status(200).json(note);
};

// POST - Create new note
const createNote = (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      message: "Please provide title, content and category",
    });
  }

  const newNote = {
    id: Date.now(),
    title,
    content,
    category,
  };

  notes.push(newNote);

  res.status(201).json({
    message: "Note created successfully",
    note: newNote,
  });
};

// PUT - Update note
const updateNote = (req, res) => {
  const id = Number(req.params.id);

  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  const { title, content, category } = req.body;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;

  res.status(200).json({
    message: "Note updated successfully",
    note,
  });
};

// DELETE - Delete note
const deleteNote = (req, res) => {
  const id = Number(req.params.id);

  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  notes.splice(noteIndex, 1);

  res.status(200).json({
    message: "Note deleted successfully",
  });
};

// Export functions
module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
