import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupDatabase, teardownDatabase, clearCollections, registerAndLogin, firstCategory } from './setup.js';

test.before(setupDatabase);
test.after(teardownDatabase);
test.beforeEach(clearCollections);

test('creates, reads, updates and deletes a transaction', async () => {
  const { agent, user } = await registerAndLogin(app);
  const category = await firstCategory(user._id, 'EXPENSE');

  const created = await agent.post('/api/transactions').send({
    title: 'Groceries',
    amountPaise: 125050,
    type: 'EXPENSE',
    categoryId: category._id,
    paymentMethod: 'UPI',
    date: '2026-11-13T10:00:00.000Z',
    description: 'Weekly shop',
  });

  assert.equal(created.status, 201);
  assert.equal(created.body.data.amountPaise, 125050);
  assert.equal(created.body.data.category.name, category.name);
  assert.equal(created.body.data.title, 'Groceries');

  const list = await agent.get('/api/transactions');
  assert.equal(list.body.data.pagination.total, 1);

  const fetched = await agent.get(`/api/transactions/${created.body.data._id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.data._id, created.body.data._id);

  const updated = await agent.patch(`/api/transactions/${created.body.data._id}`).send({
    title: 'Weekly groceries',
    amountPaise: 99000,
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.title, 'Weekly groceries');
  assert.equal(updated.body.data.amountPaise, 99000);

  const removed = await agent.delete(`/api/transactions/${created.body.data._id}`);
  assert.equal(removed.status, 200);

  const after = await agent.get('/api/transactions');
  assert.equal(after.body.data.pagination.total, 0);
});

test('rejects an invalid transaction body', async () => {
  const { agent, user } = await registerAndLogin(app);
  const category = await firstCategory(user._id, 'EXPENSE');

  const negative = await agent.post('/api/transactions').send({
    title: 'Bad',
    amountPaise: -100,
    type: 'EXPENSE',
    categoryId: category._id,
    paymentMethod: 'CASH',
    date: '2026-11-13T10:00:00.000Z',
  });
  assert.equal(negative.status, 400);

  const missingType = await agent.post('/api/transactions').send({
    title: 'Bad',
    amountPaise: 100,
    categoryId: category._id,
    paymentMethod: 'CASH',
    date: '2026-11-13T10:00:00.000Z',
  });
  assert.equal(missingType.status, 400);

  const badMethod = await agent.post('/api/transactions').send({
    title: 'Bad',
    amountPaise: 100,
    type: 'EXPENSE',
    categoryId: category._id,
    paymentMethod: 'CRYPTO',
    date: '2026-11-13T10:00:00.000Z',
  });
  assert.equal(badMethod.status, 400);
});

test('rejects a transaction whose category type does not match', async () => {
  const { agent, user } = await registerAndLogin(app);
  const expenseCategory = await firstCategory(user._id, 'EXPENSE');

  const response = await agent.post('/api/transactions').send({
    title: 'Salary',
    amountPaise: 500000,
    type: 'INCOME',
    categoryId: expenseCategory._id,
    paymentMethod: 'BANK_TRANSFER',
    date: '2026-11-13T10:00:00.000Z',
  });

  assert.equal(response.status, 400);
  assert.match(response.body.error.message, /expense category/i);
});

test('rejects an invalid Mongo id and an unknown id', async () => {
  const { agent } = await registerAndLogin(app);

  const malformed = await agent.get('/api/transactions/not-an-id');
  assert.equal(malformed.status, 400);

  const unknown = await agent.get('/api/transactions/64b7f9f8e1a2b3c4d5e6f7a8');
  assert.equal(unknown.status, 404);
});

test('filters, sorts and paginates transactions', async () => {
  const { agent, user } = await registerAndLogin(app);
  const food = await firstCategory(user._id, 'EXPENSE');

  const entries = [
    { title: 'Apple', amountPaise: 50000, date: '2026-11-01T10:00:00.000Z' },
    { title: 'Banana', amountPaise: 20000, date: '2026-11-05T10:00:00.000Z' },
    { title: 'Cherry', amountPaise: 90000, date: '2026-11-09T10:00:00.000Z' },
  ];

  for (const entry of entries) {
    await agent.post('/api/transactions').send({
      ...entry,
      type: 'EXPENSE',
      categoryId: food._id,
      paymentMethod: 'UPI',
    });
  }

  const sorted = await agent.get('/api/transactions?sort=amount_desc');
  assert.equal(sorted.body.data.items[0].title, 'Cherry');

  const searched = await agent.get('/api/transactions?search=ban');
  assert.equal(searched.body.data.pagination.total, 1);
  assert.equal(searched.body.data.items[0].title, 'Banana');

  const paged = await agent.get('/api/transactions?page=2&limit=2');
  assert.equal(paged.body.data.items.length, 1);
  assert.equal(paged.body.data.pagination.total, 3);
  assert.equal(paged.body.data.pagination.totalPages, 2);

  const byType = await agent.get('/api/transactions?type=INCOME');
  assert.equal(byType.body.data.pagination.total, 0);
});

test('a user cannot read, update or delete another user\'s transaction', async () => {
  const { agent: agentA, user: userA } = await registerAndLogin(app);
  const { agent: agentB } = await registerAndLogin(app);

  const category = await firstCategory(userA._id, 'EXPENSE');
  const created = await agentA.post('/api/transactions').send({
    title: 'Private expense',
    amountPaise: 10000,
    type: 'EXPENSE',
    categoryId: category._id,
    paymentMethod: 'CASH',
    date: '2026-11-13T10:00:00.000Z',
  });

  const id = created.body.data._id;

  assert.equal((await agentB.get(`/api/transactions/${id}`)).status, 404);
  assert.equal((await agentB.patch(`/api/transactions/${id}`).send({ title: 'Hacked' })).status, 404);
  assert.equal((await agentB.delete(`/api/transactions/${id}`)).status, 404);

  const listB = await agentB.get('/api/transactions');
  assert.equal(listB.body.data.pagination.total, 0);

  const stillThere = await agentA.get(`/api/transactions/${id}`);
  assert.equal(stillThere.status, 200);
  assert.equal(stillThere.body.data.title, 'Private expense');
});

test('a transaction cannot use another user\'s category', async () => {
  const { user: userA } = await registerAndLogin(app);
  const { agent: agentB } = await registerAndLogin(app);

  const categoryA = await firstCategory(userA._id, 'EXPENSE');

  const response = await agentB.post('/api/transactions').send({
    title: 'Sneaky',
    amountPaise: 10000,
    type: 'EXPENSE',
    categoryId: categoryA._id,
    paymentMethod: 'CASH',
    date: '2026-11-13T10:00:00.000Z',
  });

  assert.equal(response.status, 400);
});

test('requires authentication', async () => {
  const response = await request(app).get('/api/transactions');
  assert.equal(response.status, 401);
});
