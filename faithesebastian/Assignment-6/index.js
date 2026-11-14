const express = require('express');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/notes', noteRoutes);

app.listen(port, () => {
  console.log(`Notes API listening on port ${port}`);
});
