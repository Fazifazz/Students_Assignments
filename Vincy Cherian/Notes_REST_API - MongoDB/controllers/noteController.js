
const Note = require('../Models/notes')

const getNotes = async (req,res,next) =>{
    try{
        const categoryFilter = req.query.category? {category : req.query.category} : {};
        const allNotes = await Note.find(categoryFilter);

        res.status(200).json({'success': true, count : allNotes.length, data : allNotes});
    }
    catch(err)
    {
        next(err);
    }
   
}

const getNoteByID = async (req,res,next) =>{
    try
    {
        const note = await Note.findById(req.params.id)

        if(!note)
        {
            const err = new Error('Note not found');
            err.statusCode = 404;
            return next(err);
        }    
        
        res.status(200).json({'success': true, data : note})
    }
    catch(err)
    {
        next(err);
    }
    
}

const createNote = async (req, res, next) => {
    try{
        const {title, content, category} = req.body;

        if(!title || !content)
        {
            const err = new Error('Title and content are required')
            err.statusCode = 400;
            return next(err);
        }
    
        const note = new Note({title, content, category})
        await note.save()

        res.status(201).json({'success': true, 'message': 'New note added successfully', 'data': note})
    }
    catch(err){
        next(err);
    }
}

const updNote = async (req,res,next) =>{
  try{
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true}) 

        if(!updatedNote)
        {
            const err= new Error("Note not found");
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json({'success': true, 'message':'Note updated successfully', 'data': updatedNote})

    }
    catch(err)
    {
        next(err);
    }
   }

const delNote = async (req,res,next) =>{
    try
    {
        const noteDel = await Note.findByIdAndDelete(req.params.id);

        if(!noteDel)
        {
            const err = new Error('Note not found')
            err.statusCode = 404
            return next(err);
        }

        res.status(200).json({'success':true, 'message':'Deleted successfully','data' : noteDel})

    }
    catch(err)
    {
        next(err);
    }
    
}


module.exports = { getNotes,getNoteByID,createNote,updNote,delNote};