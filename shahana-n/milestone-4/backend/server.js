import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'ReadTrack API is running.' });
});
app.use('/api/books', bookRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', goalRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`ReadTrack API is running at http://localhost:${port}`);
});
