
// In-memory array with 3 pre-loaded notes

let notes = [
  {
    id: "1",
    title: "JavaScript Basics",
    content: "Learn variables, functions and arrays",
    category: "Programming"
  },
  {
    id: "2",
    title: "Express JS",
    content: "Learn routing and middleware",
    category: "Web Development"
  },
  {
    id: "3",
    title: "Node JS",
    content: "Learn backend development",
    category: "Programming"
  }
];

// GET - Retrieve all notes
const getAllNotes = (req, res) => {
  res.status(200).json(notes);
};

// GET - Retrieve a single note by ID
const getNoteById = (req, res) => {
  const note = notes.find(n => n.id === req.params.id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  res.status(200).json(note);
};

// POST - Create a new note
const createNote = (req, res) => {
  const { title, content, category } = req.body;

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    category
  };

  notes.push(newNote);

  res.status(201).json({
    message: "Note created successfully",
    note: newNote
  });
};

// PUT - Update an existing note
const updateNote = (req, res) => {
  const note = notes.find(n => n.id === req.params.id);

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  const { title, content, category } = req.body;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;

  res.status(200).json({
    message: "Note updated successfully",
    note
  });
};

// DELETE - Remove a note
const deleteNote = (req, res) => {
  const index = notes.findIndex(n => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  const deletedNote = notes.splice(index, 1)[0];

  res.status(200).json({
    message: "Note deleted successfully",
    note: deletedNote
  });
};

// Export all controller functions
module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
