require('dotenv').config();

const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`BookVault API is running on port ${port}`);
  });
}

module.exports = app;
