

require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('./Models/notes');

// Sample notes
const sampleNotes = [
    {
        title: 'Learning Node.js',
        content: 'Understanding Node.js fundamentals and backend development.',
        category: 'General'
    },
    {
        title: 'Complete Backend Assignment',
        content: 'Finish the Notes REST API assignment using Express and MongoDB.',
        category: 'Work'
    },
    {
        title: 'Personal Goals',
        content: 'Spend time learning new technologies and improving coding skills.',
        category: 'Personal'
    },
    {
        title: 'Project Ideas',
        content: 'Build a task management application using React and Node.js.',
        category: 'Ideas'
    },
    {
        title: 'Learn Mongoose',
        content: 'Practise Mongoose schemas, models, validation and CRUD operations.',
        category: 'General'
    }
];


const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB');

        // Insert sample notes
        let insertedCount = 0;

        for (const note of sampleNotes) {

            const existingNote = await Note.findOne({
                title: note.title,
                category: note.category
            });

            if (!existingNote) {
                await Note.create(note);
                insertedCount++;
            }
        }

        console.log(`${insertedCount} new notes inserted`);   

    }
    catch (err) {
        console.error('Error seeding database:', err.message);
        process.exitCode = 1;
    }
    finally {
        // Close database connection
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
    }
};

seedDatabase();
