require("dotenv").config();

const express = require("express");
const logger = require("./middleware/logger");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Debugging logs
console.log("noteRoutes:", typeof noteRoutes);
console.log("logger:", typeof logger);
console.log("notFound:", typeof notFound);
console.log("errorHandler:", typeof errorHandler);

// Middleware
app.use(express.json());
app.use(logger);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Express API running" });
});

// Note routes
app.use("/api/notes", noteRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
