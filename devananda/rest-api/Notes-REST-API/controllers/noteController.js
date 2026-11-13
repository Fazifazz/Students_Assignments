let notes = [
    {
        id: 1,
        title: "First Note",
        content: "This is my first note",
        category: "Personal"
    },
    {
        id: 2,
        title: "Second Note",
        content: "This is my second note",
        category: "Work"
    }
];

const getNotes = (req, res) => {
    res.json(notes);
};

const getNoteById = (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
};

const createNote = (req, res) => {
    const newNote = {
        id: notes.length + 1,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category
    };

    notes.push(newNote);
    res.status(201).json(newNote);
};

const updateNote = (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    note.title = req.body.title;
    note.content = req.body.content;
    note.category = req.body.category;

    res.json(note);
};

const deleteNote = (req, res) => {
    const id = Number(req.params.id);
    const index = notes.findIndex(note => note.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Note not found" });
    }

    const deletedNote = notes.splice(index, 1);

    res.json({
        message: "Note deleted successfully",
        note: deletedNote[0]
    });
};

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};