const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const Note = require("./models/noteModel");

const seedNotes = [
  {
    title: "Learning MongoDB",
    content: "Understanding MongoDB and Mongoose.",
    category: "Work",
  },
  {
    title: "Express REST API",
    content: "Practice building REST APIs using Express.",
    category: "General",
  },
  {
    title: "Complete Notes Project",
    content: "Finish CRUD operations for the Notes API.",
    category: "Work",
  },
  {
    title: "Buy Groceries",
    content: "Buy milk, bread and vegetables.",
    category: "Personal",
  },
  {
    title: "Practice JavaScript",
    content: "Revise promises and async await.",
    category: "Ideas",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log("Connected to MongoDB");

    await Note.insertMany(seedNotes);

    console.log("5 notes inserted successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedDatabase();
