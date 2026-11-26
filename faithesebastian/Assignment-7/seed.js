require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('./models/Note');

const sampleNotes = [
  {
    title: 'Welcome',
    content: 'Welcome to your persistent notes collection.',
    category: 'General',
  },
  {
    title: 'Project planning',
    content: 'Break the project into small, trackable tasks.',
    category: 'Work',
  },
  {
    title: 'Weekend reading',
    content: 'Set aside time to read a new book.',
    category: 'Personal',
  },
  {
    title: 'App idea',
    content: 'Build a simple tool to organize study notes.',
    category: 'Ideas',
  },
  {
    title: 'Review goals',
    content: 'Check progress and plan the next steps.',
    category: 'General',
  },
];

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to the .env file.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB successfully.');
  const notes = await Note.insertMany(sampleNotes);
  console.log(`Seeded ${notes.length} notes.`);
}

seedDatabase()
  .catch((error) => {
    console.error('Failed to seed notes:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
