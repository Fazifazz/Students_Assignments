// In-memory data store with at least 3 pre-loaded notes
let notes = [
  {
    id: 1,
    title: "Learn Node.js Core Modules",
    content: "Explore built-in modules like fs, path, events, and http.",
    category: "Study"
  },
  {
    id: 2,
    title: "Master Async JavaScript",
    content: "Understand callbacks, promises, and async/await in Node.js.",
    category: "Study"
  },
  {
    id: 3,
    title: "Build REST API with Express",
    content: "Implement routes, controllers, and test endpoints in Postman.",
    category: "Project"
  }
];

// @desc    Get all notes
// @route   GET /api/notes
const getAllNotes = (req, res) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
const getNoteById = (req, res) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id.toString() === id.toString());

  if (!note) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: note
  });
};

// @desc    Create a new note
// @route   POST /api/notes
const createNote = (req, res) => {
  const { title, content, category } = req.body;

  // Validation
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, content, and category"
    });
  }

  // Create new note with unique ID using Date.now()
  const newNote = {
    id: Date.now(),
    title,
    content,
    category
  };

  notes.push(newNote);

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: newNote
  });
};

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
const updateNote = (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id.toString() === id.toString());

  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${id} not found`
    });
  }

  const { title, content, category } = req.body;

  // Update only provided fields
  if (title !== undefined) notes[noteIndex].title = title;
  if (content !== undefined) notes[noteIndex].content = content;
  if (category !== undefined) notes[noteIndex].category = category;

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: notes[noteIndex]
  });
};

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
const deleteNote = (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id.toString() === id.toString());

  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${id} not found`
    });
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    data: deletedNote
  });
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
