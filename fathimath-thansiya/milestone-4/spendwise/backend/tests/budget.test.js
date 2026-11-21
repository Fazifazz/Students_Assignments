import test from 'node:test';
import assert from 'node:assert/strict';

import app from '../src/app.js';
import { setupDatabase, teardownDatabase, clearCollections, registerAndLogin, firstCategory } from './setup.js';

test.before(setupDatabase);
test.after(teardownDatabase);
test.beforeEach(clearCollections);

async function addExpense(agent, categoryId, amountPaise, date) {
  return agent.post('/api/transactions').send({
    title: 'Expense',
    amountPaise,
    type: 'EXPENSE',
    categoryId,
    paymentMethod: 'UPI',
    date,
  });
}

test('calculates spend, remaining amount and percentage from real transactions', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  await addExpense(agent, food._id, 250000, '2026-11-05T10:00:00.000Z');
  await addExpense(agent, food._id, 150000, '2026-11-08T10:00:00.000Z');

  const created = await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  assert.equal(created.status, 201);
  assert.equal(created.body.data.spentPaise, 400000);
  assert.equal(created.body.data.remainingPaise, 100000);
  assert.equal(created.body.data.usagePercent, 80);
  assert.equal(created.body.data.status, 'WARNING');
});

test('marks a budget as exceeded when spending passes the limit', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  await addExpense(agent, food._id, 900000, '2026-11-05T10:00:00.000Z');

  const created = await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  assert.equal(created.body.data.status, 'EXCEEDED');
  assert.equal(created.body.data.remainingPaise, -400000);
});

test('spend from another month does not count towards the budget', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  await addExpense(agent, food._id, 900000, '2026-10-05T10:00:00.000Z');

  const created = await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  assert.equal(created.body.data.spentPaise, 0);
  assert.equal(created.body.data.status, 'SAFE');
});

test('prevents a duplicate budget for the same category and month', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  const duplicate = await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 700000,
    month: 11,
    year: 2026,
  });

  assert.equal(duplicate.status, 409);
});

test('rejects a budget on an income category', async () => {
  const { agent, user } = await registerAndLogin(app);
  const salary = await firstCategory(user._id, 'INCOME');

  const response = await agent.post('/api/budgets').send({
    categoryId: salary._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  assert.equal(response.status, 400);
  assert.match(response.body.error.message, /expense categories/i);
});

test('budget spend recalculates when a transaction is deleted', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  const expense = await addExpense(agent, food._id, 400000, '2026-11-05T10:00:00.000Z');

  await agent.post('/api/budgets').send({
    categoryId: food._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  await agent.delete(`/api/transactions/${expense.body.data._id}`);

  const budgets = await agent.get('/api/budgets?month=11&year=2026');
  assert.equal(budgets.body.data.items[0].spentPaise, 0);
  assert.equal(budgets.body.data.items[0].status, 'SAFE');
});

test('a user cannot see or modify another user\'s budget', async () => {
  const { agent: agentA, user: userA } = await registerAndLogin(app);
  const { agent: agentB } = await registerAndLogin(app);

  const category = await firstCategory(userA._id, 'EXPENSE');
  const created = await agentA.post('/api/budgets').send({
    categoryId: category._id,
    amountPaise: 500000,
    month: 11,
    year: 2026,
  });

  const listB = await agentB.get('/api/budgets');
  assert.equal(listB.body.data.items.length, 0);

  assert.equal((await agentB.patch(`/api/budgets/${created.body.data._id}`).send({ amountPaise: 1 })).status, 404);
  assert.equal((await agentB.delete(`/api/budgets/${created.body.data._id}`)).status, 404);
});

test('savings goals track contributions and reject exceeding the target', async () => {
  const { agent } = await registerAndLogin(app);

  const created = await agent.post('/api/savings-goals').send({
    name: 'Emergency fund',
    targetAmountPaise: 1000000,
    currentAmountPaise: 200000,
    targetDate: '2027-01-01T00:00:00.000Z',
    description: 'Six months of expenses',
  });

  assert.equal(created.status, 201);
  assert.equal(created.body.data.progressPercent, 20);

  const contributed = await agent.patch(`/api/savings-goals/${created.body.data._id}`).send({
    contributionPaise: 300000,
  });
  assert.equal(contributed.status, 200);
  assert.equal(contributed.body.data.currentAmountPaise, 500000);
  assert.equal(contributed.body.data.progressPercent, 50);

  const tooMuch = await agent.patch(`/api/savings-goals/${created.body.data._id}`).send({
    contributionPaise: 900000,
  });
  assert.equal(tooMuch.status, 400);
  assert.match(tooMuch.body.error.message, /exceed the goal target/i);
});

test('rejects an invalid savings goal', async () => {
  const { agent } = await registerAndLogin(app);

  const response = await agent.post('/api/savings-goals').send({
    name: 'X',
    targetAmountPaise: -5,
    targetDate: '2027-01-01T00:00:00.000Z',
  });

  assert.equal(response.status, 400);
});

test('a user cannot modify another user\'s savings goal', async () => {
  const { agent: agentA } = await registerAndLogin(app);
  const { agent: agentB } = await registerAndLogin(app);

  const created = await agentA.post('/api/savings-goals').send({
    name: 'Private goal',
    targetAmountPaise: 1000000,
    targetDate: '2027-01-01T00:00:00.000Z',
  });

  assert.equal(
    (await agentB.patch(`/api/savings-goals/${created.body.data._id}`).send({ name: 'Hacked' })).status,
    404,
  );
  assert.equal((await agentB.delete(`/api/savings-goals/${created.body.data._id}`)).status, 404);
});
