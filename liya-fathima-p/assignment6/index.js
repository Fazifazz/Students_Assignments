const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});