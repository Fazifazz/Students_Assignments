// controllers/noteController.js
// Holds the in-memory data and the logic for each endpoint.

// ---------------------------------------------------------------
// In-memory "database": an ordinary JavaScript array.
// Data resets every time the server restarts (that's expected).
// ---------------------------------------------------------------
const notes = [
  {
    id: 1,
    title: 'Welcome to Notes API',
    content: 'This is your first pre-loaded note.',
    category: 'General',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Grocery List',
    content: 'Milk, eggs, bread, and fruits.',
    category: 'Personal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Study Plan',
    content: 'Revise Node.js and Express routing for 2 hours.',
    category: 'Study',
    createdAt: new Date().toISOString(),
  },
];

// Small helper: true only for a non-empty string like "Hello"
const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

// ---------------------------------------------------------------
// GET /api/notes  ->  return all notes
// ---------------------------------------------------------------
const getAllNotes = (req, res) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes,
  });
};

// ---------------------------------------------------------------
// GET /api/notes/:id  ->  return one note, or 404
// ---------------------------------------------------------------
const getNoteById = (req, res) => {
  const id = Number(req.params.id); // URL params are strings, ids are numbers
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${req.params.id} not found`,
    });
  }

  res.status(200).json({ success: true, data: note });
};

// ---------------------------------------------------------------
// POST /api/notes  ->  create a note (201), or 400 if invalid
// ---------------------------------------------------------------
const createNote = (req, res) => {
  const { title, content, category } = req.body || {};

  // Validate input
  const errors = [];
  if (!isNonEmptyString(title)) {
    errors.push('title is required and must be a non-empty string');
  }
  if (!isNonEmptyString(content)) {
    errors.push('content is required and must be a non-empty string');
  }
  if (category !== undefined && !isNonEmptyString(category)) {
    errors.push('category must be a non-empty string');
  }
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Unique ID using Date.now().
  // The loop is a safety net in case two notes are created in the same millisecond.
  let id = Date.now();
  while (notes.some((n) => n.id === id)) {
    id++;
  }

  const newNote = {
    id,
    title: title.trim(),
    content: content.trim(),
    category: category ? category.trim() : 'General',
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: newNote,
  });
};

// ---------------------------------------------------------------
// PUT /api/notes/:id  ->  update a note (partial updates allowed)
// ---------------------------------------------------------------
const updateNote = (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${req.params.id} not found`,
    });
  }

  const { title, content, category } = req.body || {};

  // At least one field must be sent
  if (title === undefined && content === undefined && category === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one field to update: title, content, or category',
    });
  }

  // Validate only the fields that were sent
  const errors = [];
  if (title !== undefined && !isNonEmptyString(title)) {
    errors.push('title must be a non-empty string');
  }
  if (content !== undefined && !isNonEmptyString(content)) {
    errors.push('content must be a non-empty string');
  }
  if (category !== undefined && !isNonEmptyString(category)) {
    errors.push('category must be a non-empty string');
  }
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Apply only the fields that were sent
  if (title !== undefined) note.title = title.trim();
  if (content !== undefined) note.content = content.trim();
  if (category !== undefined) note.category = category.trim();
  note.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: note,
  });
};

// ---------------------------------------------------------------
// DELETE /api/notes/:id  ->  remove a note, or 404
// ---------------------------------------------------------------
const deleteNote = (req, res) => {
  const id = Number(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Note with id ${req.params.id} not found`,
    });
  }

  const [deletedNote] = notes.splice(index, 1); // remove 1 item at that position

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
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
