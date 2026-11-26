
// Import packages
require('dotenv').config();

console.log('Seed file is executing...');

const mongoose = require('mongoose');
const Note = require('./models/Note');
// Sample notes
const sampleNotes = [

    {
        title: 'Learn JavaScript',
        content: 'Study JavaScript functions, arrays and objects.',
        category: 'General'
    },

    {
        title: 'Complete Backend Assignment',
        content: 'Finish Notes REST API using MongoDB.',
        category: 'Work'
    },

    {
        title: 'Daily Study Routine',
        content: 'Prepare a daily study timetable.',
        category: 'Personal'
    },

    {
        title: 'AI Project Idea',
        content: 'Develop an AI based study planner.',
        category: 'Ideas'
    },

    {
        title: 'Learn MongoDB',
        content: 'Practice MongoDB queries and Mongoose.',
        category: 'Work'
    }

];

// Insert sample notes
const seedDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected for Seeding');

        await Note.insertMany(sampleNotes);

        console.log('5 Sample Notes Inserted Successfully!');

    } catch (error) {

        console.error('Seeding Error:', error);

    } finally {

        await mongoose.connection.close();

        console.log('Database Connection Closed');

    }

};

seedDatabase();
