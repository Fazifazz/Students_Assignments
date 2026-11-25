require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Note = require("./models/Note");

const notes = [
  {
    title: "Learn MongoDB",
    content: "Study MongoDB and Mongoose",
    category: "General"
  },
  {
    title: "Work Tasks",
    content: "Complete today's work tasks",
    category: "Work"
  },
  {
    title: "Personal Goals",
    content: "Plan personal goals for this week",
    category: "Personal"
  },
  {
    title: "Project Ideas",
    content: "Build a useful notes application",
    category: "Ideas"
  },
  {
    title: "Practice Coding",
    content: "Practice Node.js and Express",
    category: "General"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");

    await Note.deleteMany({});
    await Note.insertMany(notes);

    console.log("5 sample notes inserted successfully");

    await mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Seed error:", error);
  });