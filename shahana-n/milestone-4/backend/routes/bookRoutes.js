import { Router } from 'express';
import { createBook, deleteBook, getBook, getBooks, toggleFavorite, updateBook, updateProgress } from '../controllers/bookController.js';

const router = Router();

router.route('/').get(getBooks).post(createBook);
router.route('/:bookId').get(getBook).put(updateBook).delete(deleteBook);
router.patch('/:bookId/progress', updateProgress);
router.patch('/:bookId/favourite', toggleFavorite);

export default router;
