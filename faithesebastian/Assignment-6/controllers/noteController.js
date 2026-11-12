const notes = [
  { id: 1, title: 'Welcome', content: 'Welcome to your notes.', category: 'General' },
  { id: 2, title: 'Ideas', content: 'Capture ideas as they come.', category: 'Personal' },
  { id: 3, title: 'Tasks', content: 'Keep track of things to do.', category: 'Work' },
];

function getNotes(req, res) {
  res.json(notes);
}

function getNoteById(req, res) {
  const note = notes.find((item) => String(item.id) === req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(note);
}

function createNote(req, res) {
  const { title, content, category } = req.body || {};
  let id = Date.now();
  while (notes.some((note) => note.id === id)) {
    id += 1;
  }

  const note = { id, title, content, category };
  notes.push(note);
  res.status(201).json(note);
}

function updateNote(req, res) {
  const note = notes.find((item) => String(item.id) === req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { title, content, category } = req.body || {};
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;

  res.json(note);
}

function deleteNote(req, res) {
  const index = notes.findIndex((item) => String(item.id) === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(index, 1);
  res.json({ message: 'Note deleted successfully' });
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
