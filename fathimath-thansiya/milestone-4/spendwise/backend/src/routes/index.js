import { Router } from 'express';
import authRoutes from './auth.routes.js';
import transactionRoutes from './transaction.routes.js';
import categoryRoutes from './category.routes.js';
import budgetRoutes from './budget.routes.js';
import savingsGoalRoutes from './savingsGoal.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import analyticsRoutes from './analytics.routes.js';

/**
 * API router registry. Each resource owns its own router file so the app
 * stays readable as the API grows.
 */
const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'SpendWise API',
      version: '0.2.0',
      modules: [
        'auth',
        'transactions',
        'categories',
        'budgets',
        'savings-goals',
        'dashboard',
        'analytics',
      ],
    },
  });
});

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/savings-goals', savingsGoalRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
