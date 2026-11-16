import { Router } from 'express';
import { createWishlistBook, deleteWishlistBook, getWishlist, moveWishlistBookToLibrary } from '../controllers/wishlistController.js';

const router = Router();

router.route('/').get(getWishlist).post(createWishlistBook);
router.delete('/:wishlistId', deleteWishlistBook);
router.post('/:wishlistId/move-to-library', moveWishlistBookToLibrary);

export default router;
