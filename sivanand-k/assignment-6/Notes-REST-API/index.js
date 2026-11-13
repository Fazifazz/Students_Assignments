const express = require("express");

const app = express();

// Middleware: allows Express to read JSON
app.use(express.json());

// Import routes
const noteRoutes = require("./routes/noteRoutes");

// Connect routes
app.use("/api/notes", noteRoutes);

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
