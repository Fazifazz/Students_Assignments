import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/transaction.controller.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsSchema,
  transactionIdSchema,
} from '../validators/transaction.validator.js';

const router = Router();

// Every transaction route requires a session.
router.use(requireAuth);

router.get('/', validate(listTransactionsSchema, 'query'), asyncHandler(controller.list));
router.post('/', validate(createTransactionSchema), asyncHandler(controller.create));
router.get('/:id', validate(transactionIdSchema, 'params'), asyncHandler(controller.getById));
router.patch(
  '/:id',
  validate(transactionIdSchema, 'params'),
  validate(updateTransactionSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(transactionIdSchema, 'params'), asyncHandler(controller.remove));

export default router;
