const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use((request, response, next) => {
  const origin = request.get("Origin");
  if (origin && allowedOrigins.has(origin)) {
    response.set("Access-Control-Allow-Origin", origin);
    response.set("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    return response.sendStatus(204);
  }

  return next();
});
app.use(express.json({ limit: "100kb" }));
app.use("/api/tasks", taskRoutes);

app.use("/api", (request, response) => {
  response.status(404).json({ error: "API endpoint not found." });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }

  console.error(error);
  return response.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`Smart Task Manager is running at http://localhost:${PORT}`);
});
