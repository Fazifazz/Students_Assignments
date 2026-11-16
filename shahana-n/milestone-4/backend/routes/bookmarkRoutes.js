import { Router } from 'express';
import { createBookmark, deleteBookmark, getAllBookmarks, getBookBookmarks, updateBookmark } from '../controllers/bookmarkController.js';

const router = Router();

router.get('/bookmarks', getAllBookmarks);
router.route('/books/:bookId/bookmarks').get(getBookBookmarks).post(createBookmark);
router.route('/books/:bookId/bookmarks/:bookmarkId').put(updateBookmark).delete(deleteBookmark);

export default router;
