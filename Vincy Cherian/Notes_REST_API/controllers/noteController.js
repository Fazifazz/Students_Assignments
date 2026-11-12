
const Note = require('../Models/notes')

const getNotes = (req,res) =>{
   const allNotes = Note.getAll;
   res.status(200).json({'success': true, data : allNotes})
}

const getNoteByID = (req,res) =>{
    const note = Note.getById(parseInt(req.params.id))

    if(!note)
        res.status(404).json({'success': false, 'message': 'No note found with this id'})
        
    else
       res.status(200).json({'success': true, data : note})
}

const createNote = (req, res) => {
    const {title, content, category} = req.body;

    if(!title || !content || !category)
        return res.status(400).json({'success': false,'message': 'Title, content and category are required'})

    const newNote = Note.createNote(title, content, category)

    res.status(201).json({'success': true, 'message': 'New note added successfully', 'data': newNote})
}

const updNote = (req,res) =>{
    const noteId = Note.getId(parseInt(req.params.id));

    if(noteId === -1)
        return res.status(404).json({'success': false, 'message':'No note found with this id'})

    const {title,content,category} = req.body;
    const updatedNote = Note.updNote(title,content,category,noteId) 
    res.status(200).json({'success': true, 'message':'Note updated successfully', 'data': updatedNote})
}

const delNote = (req,res) =>{
    const note = Note.getById(parseInt(req.params.id))

    if(!note)
        return res.status(404).json({'success':false, 'message': 'Note not found'})

    const newUpdNote = Note.deleteNote(note.id)

    res.status(200).json({'success':true, 'message':'Deleted successfully','data': newUpdNote, 'deletedNote' : note})

}


module.exports = { getNotes,getNoteByID,createNote,updNote,delNote};