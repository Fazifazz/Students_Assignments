require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");

const Note = require("./models/Note");

const app = express();

app.use(express.json());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });


// Home Route
app.get("/", (req, res) => {
  res.send("MongoDB Assignment API is running");
});


// 1. CREATE NOTE - POST
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const note = await Note.create(req.body);
    console.log("Created note:", note);
    res.status(201).json(note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Failed to create note"
    });
  }
});


// 2. GET ALL NOTES - GET
// Optional category filter: /api/notes?category=Work
app.get("/api/notes", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const notes = await Note.find(filter);

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes"
    });
  }
});


// 3. GET SINGLE NOTE - GET
app.get("/api/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    // 5. DELETE NOTE - DELETE
app.delete("/api/notes/:id", async (req, res) => {
  try {
    console.log("DELETE ID:", req.params.id);
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
      deletedNote
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message
    });
  }
});

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note"
    });
  }
});


// 4. UPDATE NOTE - PUT
app.put("/api/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Failed to update note"
    });
  }
});


// 5. DELETE NOTE - DELETE
app.delete("/api/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note"
    });
  }
});


const PORT = 3000;