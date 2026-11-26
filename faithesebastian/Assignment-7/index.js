require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/notes', noteRoutes);

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to the .env file.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  app.listen(port, () => {
    console.log(`Notes API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Notes API:', error.message);
  process.exitCode = 1;
});
