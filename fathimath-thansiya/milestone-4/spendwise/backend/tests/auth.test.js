import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupDatabase, teardownDatabase, clearCollections, registerAndLogin } from './setup.js';

test.before(setupDatabase);
test.after(teardownDatabase);

test.beforeEach(clearCollections);

test('registers a user, seeds default categories and never returns the password', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Aarav Sharma', email: 'aarav@example.com', password: 'password123' });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, 'aarav@example.com');
  assert.equal(response.body.data.user.password, undefined);
  assert.match(response.headers['set-cookie'][0], /HttpOnly/);
});

test('rejects a duplicate email', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Aarav Sharma', email: 'aarav@example.com', password: 'password123' });

  const response = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Aarav Sharma', email: 'aarav@example.com', password: 'password123' });

  assert.equal(response.status, 409);
  assert.equal(response.body.success, false);
});

test('rejects an invalid registration payload', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ name: 'A', email: 'not-an-email', password: 'short' });

  assert.equal(response.status, 400);
  const fields = response.body.error.details.map((detail) => detail.field);
  assert.ok(fields.includes('name'));
  assert.ok(fields.includes('email'));
  assert.ok(fields.includes('password'));
});

test('logs in with correct credentials and rejects a wrong password', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Aarav Sharma', email: 'aarav@example.com', password: 'password123' });

  const ok = await request(app)
    .post('/api/auth/login')
    .send({ email: 'aarav@example.com', password: 'password123' });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.user.password, undefined);

  const bad = await request(app)
    .post('/api/auth/login')
    .send({ email: 'aarav@example.com', password: 'wrongpassword1' });
  assert.equal(bad.status, 401);
});

test('returns the current user for a valid session and 401 without one', async () => {
  const { agent } = await registerAndLogin(app);

  const me = await agent.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.data.user.email, me.body.data.user.email);

  const anonymous = await request(app).get('/api/auth/me');
  assert.equal(anonymous.status, 401);
});

test('logout clears the session cookie', async () => {
  const { agent } = await registerAndLogin(app);
  const response = await agent.post('/api/auth/logout');

  assert.equal(response.status, 200);
  assert.match(response.headers['set-cookie'][0], /spendwise_token=;/);
});
