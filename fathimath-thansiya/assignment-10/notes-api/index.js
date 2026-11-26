const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Connect to MongoDB, THEN start the server
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
