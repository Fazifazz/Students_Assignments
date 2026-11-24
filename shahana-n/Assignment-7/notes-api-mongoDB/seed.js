
require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('./models/Note');

const seedNotes = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);

        console.log('MongoDB connected');

        const notes = [
            {
                title: 'Learning Node.js',
                content: 'Understanding Express and backend development.',
                category: 'Work'
            },
            {
                title: 'Shopping List',
                content: 'Buy groceries and household items.',
                category: 'Personal'
            },
            {
                title: 'Project Ideas',
                content: 'Build a task management application.',
                category: 'Ideas'
            },
            {
                title: 'Meeting Notes',
                content: 'Discuss project progress with the team.',
                category: 'Work'
            },
            {
                title: 'Daily Journal',
                content: 'Write about my daily activities.',
                category: 'General'
            },
            {
                title: 'JavaScript Practice',
                content: 'Practice arrays, objects, promises, and async await.',
                category: 'Work'
            },
            {
                title: 'Travel Plans',
                content: 'Plan a weekend trip with family and explore new places.',
                category: 'Personal'
            }
        ];

        await Note.insertMany(notes);

        console.log('5 sample notes inserted successfully');

    } catch (error) {
        console.error('Error seeding notes:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedNotes();
