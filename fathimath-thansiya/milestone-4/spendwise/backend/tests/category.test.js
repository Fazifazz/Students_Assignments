import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupDatabase, teardownDatabase, clearCollections, registerAndLogin } from './setup.js';

test.before(setupDatabase);
test.after(teardownDatabase);
test.beforeEach(clearCollections);

test('seeds default income and expense categories on registration', async () => {
  const { agent } = await registerAndLogin(app);

  const response = await agent.get('/api/categories');
  assert.equal(response.status, 200);

  const items = response.body.data.items;
  assert.equal(items.length, 15);
  assert.equal(items.filter((c) => c.type === 'INCOME').length, 5);
  assert.equal(items.filter((c) => c.type === 'EXPENSE').length, 10);
  assert.ok(items.every((c) => c.isDefault === true));
});

test('creates a custom category and blocks duplicates for the same type', async () => {
  const { agent } = await registerAndLogin(app);

  const created = await agent.post('/api/categories').send({
    name: 'Coffee',
    type: 'EXPENSE',
    icon: '☕',
    color: '#8B5CF6',
  });

  assert.equal(created.status, 201);
  assert.equal(created.body.data.isDefault, false);

  const duplicate = await agent.post('/api/categories').send({
    name: 'Coffee',
    type: 'EXPENSE',
  });
  assert.equal(duplicate.status, 409);

  // The same name under a different type is allowed.
  const other = await agent.post('/api/categories').send({
    name: 'Coffee',
    type: 'INCOME',
  });
  assert.equal(other.status, 201);
});

test('updates and deletes a custom category', async () => {
  const { agent } = await registerAndLogin(app);

  const created = await agent.post('/api/categories').send({
    name: 'Coffee',
    type: 'EXPENSE',
  });

  const updated = await agent.patch(`/api/categories/${created.body.data._id}`).send({
    name: 'Cafés',
    color: '#F59E0B',
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.name, 'Cafés');

  const removed = await agent.delete(`/api/categories/${created.body.data._id}`);
  assert.equal(removed.status, 200);

  const list = await agent.get('/api/categories');
  assert.equal(list.body.data.items.filter((c) => c.name === 'Cafés').length, 0);
});

test('refuses to delete a default category', async () => {
  const { agent } = await registerAndLogin(app);
  const list = await agent.get('/api/categories');
  const food = list.body.data.items.find((c) => c.name === 'Food');

  const response = await agent.delete(`/api/categories/${food._id}`);
  assert.equal(response.status, 400);
  assert.match(response.body.error.message, /Default categories/i);
});

test('refuses to delete a category still used by transactions', async () => {
  const { agent } = await registerAndLogin(app);

  const category = await agent.post('/api/categories').send({
    name: 'Coffee',
    type: 'EXPENSE',
  });

  await agent.post('/api/transactions').send({
    title: 'Latte',
    amountPaise: 25000,
    type: 'EXPENSE',
    categoryId: category.body.data._id,
    paymentMethod: 'UPI',
    date: '2026-11-05T10:00:00.000Z',
  });

  const response = await agent.delete(`/api/categories/${category.body.data._id}`);
  assert.equal(response.status, 409);
  assert.match(response.body.error.message, /still used by/i);
});

test('a user cannot see or modify another user\'s category', async () => {
  const { agent: agentA } = await registerAndLogin(app);
  const { agent: agentB } = await registerAndLogin(app);

  const created = await agentA.post('/api/categories').send({
    name: 'Private category',
    type: 'EXPENSE',
  });

  const listB = await agentB.get('/api/categories');
  assert.equal(listB.body.data.items.filter((c) => c.name === 'Private category').length, 0);

  assert.equal(
    (await agentB.patch(`/api/categories/${created.body.data._id}`).send({ name: 'Hijacked' })).status,
    404,
  );
  assert.equal((await agentB.delete(`/api/categories/${created.body.data._id}`)).status, 404);
});

test('dashboard summary reports lifetime balance and period savings', async () => {
  const { agent } = await registerAndLogin(app);
  const categories = await agent.get('/api/categories');
  const income = categories.body.data.items.find((c) => c.type === 'INCOME');
  const expense = categories.body.data.items.find((c) => c.type === 'EXPENSE');

  await agent.post('/api/transactions').send({
    title: 'Salary',
    amountPaise: 5000000,
    type: 'INCOME',
    categoryId: income._id,
    paymentMethod: 'BANK_TRANSFER',
    date: '2026-11-02T10:00:00.000Z',
  });

  await agent.post('/api/transactions').send({
    title: 'Groceries',
    amountPaise: 125000,
    type: 'EXPENSE',
    categoryId: expense._id,
    paymentMethod: 'UPI',
    date: '2026-11-10T10:00:00.000Z',
  });

  const summary = await agent.get('/api/dashboard/summary?month=11&year=2026');
  assert.equal(summary.status, 200);
  assert.equal(summary.body.data.totalIncomePaise, 5000000);
  assert.equal(summary.body.data.totalExpensesPaise, 125000);
  assert.equal(summary.body.data.balancePaise, 4875000);
  assert.equal(summary.body.data.totalSavingsPaise, 4875000);
  assert.equal(summary.body.data.savingsRatePercent, 97.5);
});

test('dashboard recent transactions and spending overview respond', async () => {
  const { agent } = await registerAndLogin(app);

  const recent = await agent.get('/api/dashboard/recent-transactions?limit=5');
  assert.equal(recent.status, 200);
  assert.ok(Array.isArray(recent.body.data.items));

  const overview = await agent.get('/api/dashboard/spending-overview?month=11&year=2026');
  assert.equal(overview.status, 200);
  assert.equal(overview.body.data.monthly.length, 6);
  assert.ok(Array.isArray(overview.body.data.insights));
});

test('insights stay empty for a user with no transactions', async () => {
  const { agent } = await registerAndLogin(app);

  const overview = await agent.get('/api/dashboard/spending-overview');
  assert.deepEqual(overview.body.data.insights, []);
});

test('analytics endpoints return monthly, category and trend reports', async () => {
  const { agent } = await registerAndLogin(app);

  const monthly = await agent.get('/api/analytics/monthly?year=2026');
  assert.equal(monthly.status, 200);
  assert.equal(monthly.body.data.items.length, 12);

  const categories = await agent.get('/api/analytics/categories?month=11&year=2026');
  assert.equal(categories.status, 200);

  const trends = await agent.get('/api/analytics/trends?months=6');
  assert.equal(trends.status, 200);
  assert.equal(trends.body.data.items.length, 6);
});

test('requires authentication for every protected endpoint', async () => {
  const endpoints = [
    '/api/auth/me',
    '/api/transactions',
    '/api/categories',
    '/api/budgets',
    '/api/savings-goals',
    '/api/dashboard/summary',
    '/api/analytics/monthly',
  ];

  for (const endpoint of endpoints) {
    const response = await request(app).get(endpoint);
    assert.equal(response.status, 401, `${endpoint} should require authentication`);
  }
});
