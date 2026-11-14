
const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResolveIt backend is running successfully"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
