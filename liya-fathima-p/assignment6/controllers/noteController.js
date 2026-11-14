
let notes = [
    {
        id: 1,
        title: "Build an AI-Powered Recipe Finder",
        content: "Create an application that suggests recipes based on available ingredients and generates personalized meal recommendations.",
        category: "Projects"
    },
    {
        id: 2,
        title: "Digital Detox Challenge",
        content: "Avoid unnecessary social media usage for 7 days, disable unwanted notifications, and spend more time on productive activities.",
        category: "Lifestyle"
    },
    {
        id: 3,
        title: "Organize a Tech Workshop",
        content: "Prepare a beginner-friendly workshop covering GitHub basics, API development, and practical web development exercises.",
        category: "Events"
    },
    {
        id: 4,
        title: "Explore Cloud Computing",
        content: "Learn about AWS Lambda, serverless architecture, cloud storage, and deploying applications using cloud services.",
        category: "Learning"
    },
    {
        id: 5,
        title: "Create a Personal Reading Journal",
        content: "Maintain a digital journal to record completed books, memorable quotes, personal reviews, and monthly reading goals.",
        category: "Personal"
    },
    {
        id: 6,
        title: "Plan a Sustainable Workspace",
        content: "Organize the desk, reduce paper usage, manage electronic waste, and create an energy-efficient workspace.",
        category: "Lifestyle"
    },
    {
        id: 7,
        title: "Prepare for a Developer Interview",
        content: "Practice JavaScript fundamentals, Node.js concepts, REST API questions, problem-solving exercises, and project explanations.",
        category: "Career"
    },
    {
        id: 8,
        title: "Launch a Community Skill Exchange",
        content: "Develop a platform where people can teach skills they know and learn new skills from others through peer-to-peer sessions.",
        category: "Ideas"
    }
];

const getAllNotes=(req,res)=>{
    res.status(200).json(notes);
}

const getNoteById=(req,res)=>{
    const id=parseInt(req.params.id);
    const note=notes.find(n=>n.id===id);
    if(!note){
        res.status(404).json({message:"Note not found"});
    }else{
        res.status(200).json(note);
    }
}

const createNote=(req,res)=>{
    const{title,content,category }=req.body;
    const newNote={
        id:Date.now(),
        title,
        content,
        category 
    };
    notes.push(newNote);
    res.status(201).json(newNote);
}

const updateNote=(req,res)=>{
    const id=parseInt(req.params.id);
    const note=notes.find(n=>n.id===id);
    if(!note){
        res.status(404).json({message:"Note not found"});
    } else {
        const {title, content,category } = req.body;
        note.title = title;
        note.content = content;
        note.category = category ;
        res.status(200).json(note);
    }
}

const deleteNote=(req,res)=>{
    const id=parseInt(req.params.id);
    const noteIndex = notes.findIndex((note) => note.id === id);
    if(noteIndex === -1){
        res.status(404).json({message:"note not found"});

    }else{
        notes.splice(noteIndex,1);
        res.status(200).json({message:"note deleted succesfully"});
    }
}

module.exports = {
getAllNotes,
getNoteById,
createNote,
updateNote,
deleteNote
};