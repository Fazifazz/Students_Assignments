
const notes = [
  {
    id: 1,
    title: "Learning Node.js",
    content: "Node.js allows us to run JavaScript outside the browser. It is commonly used for backend development.",
    category: "Learning"
  },
  {
    id: 2,
    title: "Express.js Basics",
    content: "Express.js is a lightweight framework for Node.js that helps us build REST APIs and handle HTTP requests.",
    category: "Programming"
  },
  {
    id: 3,
    title: "MongoDB Introduction",
    content: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.",
    category: "Database"
  },
  {
    id: 4,
    title: "Daily Tasks",
    content: "Complete the backend assignment, practise API development, and test all endpoints using Postman.",
    category: "Personal"
  },
  {
    id: 5,
    title: "React and Redux Revision",
    content: "Revise React hooks, component communication, Redux store, actions, and reducers.",
    category: "Learning"
  }
];


const Note = {
      getAll : notes,

      getById : (id)=>{
        return notes.find(n => n.id === id)
      },

      getId : (id)=>{
        return notes.findIndex(n => n.id === id)
      },

      createNote : (title, content, category)=>{
        const newNote =  {'id': Date.now(), 'title': title, 'content': content, 'category': category}
        notes.push(newNote)
        return notes
      },

      updNote : (title,content,category,noteId)=>{
        if(title) 
              notes[noteId].title=title
        if(content)
              notes[noteId].content = content
        if(category)
              notes[noteId].category = category

        return notes[noteId]
      },

      deleteNote : (id)=>{
       return notes.filter(n => n.id !== id)
      }
}

module.exports = Note;
