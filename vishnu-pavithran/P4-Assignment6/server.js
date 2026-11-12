require("dotenv").config();
const express = require("express");
const notesRoutes = require("./routes/noteRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware: parse JSON bodies into req.body
app.use(express.json());

// All notes routes start with /api/notes
app.use("/api/notes", notesRoutes);

// First route
app.get("/", (req, res) => {
  res.json({ message: "Express API is running" });
});
// 404 catch-all: MUST be last
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
