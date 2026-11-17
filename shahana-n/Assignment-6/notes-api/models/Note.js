
let notes = [
  {
    id: 1,
    title: "Learning Node.js",
    content: "Understanding Node.js basics",
    category: "Learning"
  },
  {
    id: 2,
    title: "Express Basics",
    content: "Learning Express routing",
    category: "Development"
  },
  {
    id: 3,
    title: "JavaScript Practice",
    content: "Practicing JavaScript problems",
    category: "Practice"
  }
];

// Get all notes
const getAll = () => {
  return notes;
};

// Get note by ID
const getById = (id) => {
  return notes.find(note => note.id === parseInt(id));
};

// Create a new note
const create = (data) => {
  let id = Date.now();

  // Ensure ID is unique
  while (notes.some(note => note.id === id)) {
    id++;
  }

  const newNote = {
    id,...data
  };

  notes.push(newNote);

  return newNote;
};

// Update note
const update = (id,fields) => {
  const idx = notes.findIndex(u => u.id === parseInt(id));

  if(idx === -1) return null;

  if(fields.title ) notes[idx].title = fields.title;
  if(fields.content ) notes[idx].content = fields.content;
  if(fields.category ) notes[idx].category = fields.category;

  return notes[idx];
};

// Delete note
const remove = (id) => {
  const index = notes.findIndex(note => note.id === parseInt(id));

  if (index === -1) {
    return null;
  }

  return notes.splice(index, 1)[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
