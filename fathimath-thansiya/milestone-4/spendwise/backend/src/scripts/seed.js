import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import env from '../config/env.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import DEFAULT_CATEGORIES from '../utils/defaultCategories.js';

/**
 * Seeds a demo account with six months of realistic activity.
 *
 * Usage: `npm run seed`
 * The demo credentials are printed at the end.
 */

const DEMO_EMAIL = 'demo@spendwise.app';
const DEMO_PASSWORD = 'password123';

let seed = 20261113;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (min, max) => Math.floor(random() * (max - min + 1)) + min;

const EXPENSE_PLAN = [
  { name: 'Food', count: 20, min: 18000, max: 95000, titles: ['Groceries', 'Weekend dining', 'Coffee & snacks', 'Lunch with team', 'Dinner out'] },
  { name: 'Shopping', count: 8, min: 45000, max: 320000, titles: ['Running shoes', 'Headphones', 'Winter jacket', 'Desk setup', 'Skincare'] },
  { name: 'Transportation', count: 11, min: 12000, max: 90000, titles: ['Metro recharge', 'Fuel', 'Ride to office', 'Cab home', 'Auto fare'] },
  { name: 'Rent', count: 1, min: 1800000, max: 1800000, titles: ['Monthly rent'] },
  { name: 'Bills', count: 6, min: 35000, max: 160000, titles: ['Electricity bill', 'Mobile recharge', 'Internet bill', 'Water bill', 'Gas cylinder'] },
  { name: 'Healthcare', count: 3, min: 25000, max: 180000, titles: ['Doctor consultation', 'Medicines', 'Dental checkup'] },
  { name: 'Entertainment', count: 7, min: 15000, max: 110000, titles: ['Movie tickets', 'Streaming subscription', 'Concert', 'Board game'] },
  { name: 'Travel', count: 3, min: 180000, max: 640000, titles: ['Flight tickets', 'Hotel stay', 'Taxis abroad'] },
];

const PAYMENT_METHODS = ['CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'];

async function run() {
  await connectDatabase();
  console.log(`[seed] connected to ${mongoose.connection.name}`);

  await Promise.all([
    User.deleteMany({ email: DEMO_EMAIL }),
  ]);

  const user = await User.create({
    name: 'Aarav Sharma',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  console.log(`[seed] user ${DEMO_EMAIL} created`);

  const categories = await Category.insertMany(
    DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      userId: user._id,
      isDefault: true,
    })),
  );
  const byName = new Map(categories.map((category) => [category.name, category]));

  const transactions = [];
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo -= 1) {
    const monthStart = dayjs().startOf('month').subtract(monthsAgo, 'month');

    transactions.push({
      userId: user._id,
      title: 'Monthly salary',
      amountPaise: 8500000 + between(0, 250000),
      type: 'INCOME',
      categoryId: byName.get('Salary')._id,
      description: 'Credited to bank account',
      paymentMethod: 'BANK_TRANSFER',
      date: monthStart.date(2).toISOString(),
    });

    if (random() > 0.45) {
      transactions.push({
        userId: user._id,
        title: pick(['Freelance project', 'Design retainer', 'Consulting work']),
        amountPaise: between(400000, 1800000),
        type: 'INCOME',
        categoryId: byName.get('Freelance')._id,
        description: 'Side project payment',
        paymentMethod: 'UPI',
        date: monthStart.date(between(6, 24)).toISOString(),
      });
    }

    EXPENSE_PLAN.forEach((plan) => {
      for (let i = 0; i < plan.count; i += 1) {
        const day = between(1, monthsAgo === 0 ? Math.max(1, dayjs().date()) : 28);
        transactions.push({
          userId: user._id,
          title: pick(plan.titles),
          amountPaise: between(plan.min, plan.max),
          type: 'EXPENSE',
          categoryId: byName.get(plan.name)._id,
          description: '',
          paymentMethod: pick(PAYMENT_METHODS),
          date: monthStart.date(Math.min(day, 28)).hour(between(8, 21)).toISOString(),
        });
      }
    });
  }

  await Transaction.insertMany(transactions);
  console.log(`[seed] ${transactions.length} transactions created`);

  const current = dayjs();
  const nextMonth = current.startOf('month').add(1, 'month');
  const spendByCategory = new Map();
  transactions.forEach((txn) => {
    if (txn.type !== 'EXPENSE') return;
    if (!dayjs(txn.date).isAfter(current.startOf('month')) || dayjs(txn.date).isAfter(nextMonth)) return;
    spendByCategory.set(txn.categoryId, (spendByCategory.get(txn.categoryId) || 0) + txn.amountPaise);
  });

  const budgetPlans = [
    { name: 'Food', ratio: 0.95 },
    { name: 'Shopping', ratio: 0.8 },
    { name: 'Transportation', ratio: 1.15 },
    { name: 'Entertainment', ratio: 0.6 },
  ];

  await Budget.insertMany(
    budgetPlans.map((plan) => {
      const category = byName.get(plan.name);
      const spent = spendByCategory.get(category._id) || 0;
      const limit = Math.max(200000, Math.round(spent / plan.ratio / 10000) * 10000);
      return {
        userId: user._id,
        categoryId: category._id,
        amountPaise: limit,
        month: current.month() + 1,
        year: current.year(),
      };
    }),
  );
  console.log(`[seed] ${budgetPlans.length} budgets created`);

  await SavingsGoal.insertMany([
    {
      userId: user._id,
      name: 'Emergency fund',
      targetAmountPaise: 15000000,
      currentAmountPaise: 9250000,
      targetDate: dayjs().add(8, 'month').format('YYYY-MM-DD'),
      description: 'Six months of living expenses for emergencies.',
    },
    {
      userId: user._id,
      name: 'Buy a laptop',
      targetAmountPaise: 1800000,
      currentAmountPaise: 1260000,
      targetDate: dayjs().add(3, 'month').format('YYYY-MM-DD'),
      description: 'MacBook Pro for development work.',
    },
    {
      userId: user._id,
      name: 'Travel to Japan',
      targetAmountPaise: 4500000,
      currentAmountPaise: 1350000,
      targetDate: dayjs().add(10, 'month').format('YYYY-MM-DD'),
      description: 'Flights, hotels and a rail pass.',
    },
  ]);
  console.log('[seed] 3 savings goals created');

  console.log('\n─────────────────────────────────────────────');
  console.log('  Demo account ready');
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log(`  Database: ${env.mongoUri}`);
  console.log('─────────────────────────────────────────────\n');

  await disconnectDatabase();
}

run().catch((error) => {
  console.error('[seed] failed:', error);
  process.exit(1);
});
