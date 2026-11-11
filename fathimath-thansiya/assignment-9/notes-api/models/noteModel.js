let notes = [
  {
    id: 1,
    title: "Learn Node.js",
    content: "Understand Node.js fundamentals",
    category: "Learning",
  },
  {
    id: 2,
    title: "Learn Express",
    content: "Build REST APIs using Express",
    category: "Programming",
  },
  {
    id: 3,
    title: "Practice JavaScript",
    content: "Solve JavaScript problems",
    category: "Practice",
  },
];

// Get all notes
const getAll = () => {
  return notes;
};

// Get a note by ID
const getById = (id) => {
  return notes.find((note) => note.id === parseInt(id));
};

// Create a new note
const create = (note) => {
  const newNote = {
    id: Date.now(),
    title: note.title,
    content: note.content,
    category: note.category,
  };
  notes.push(newNote);
  return newNote;
};

// Update a note by ID

const update = (id, updatedData) => {
  const index = notes.findIndex((note) => note.id === parseInt(id));

  if (index === -1) return null;

  Object.assign(notes[index], updatedData);

  return notes[index];
};

// Delete note
const remove = (id) => {
  const index = notes.findIndex((note) => note.id === parseInt(id));

  if (index === -1) return null;

  return notes.splice(index, 1)[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
