
const express = require("express");

const app = express();

// Middleware to read JSON request body
app.use(express.json());

// Import note routes
const noteRoutes = require("./routes/noteRoutes");

// Connect routes
app.use("/api/notes", noteRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Notes REST API is running!");
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
