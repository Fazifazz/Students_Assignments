const path = require("node:path");
const express = require("express");

const app = express();
const PORT = Number(process.env.FRONTEND_PORT) || 3000;
const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));

app.listen(PORT, () => {
  console.log(`Smart Task Manager frontend is running at http://localhost:${PORT}`);
});
