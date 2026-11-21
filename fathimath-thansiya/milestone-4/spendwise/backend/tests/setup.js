import path from 'node:path';
import mongoose from 'mongoose';
import request from 'supertest';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';

/**
 * Test harness helpers.
 *
 * Tests run against a real MongoDB database so the aggregation pipelines and
 * indexes behave exactly as they do in production.
 *
 * Node's test runner executes test *files* in parallel. Each file therefore
 * gets its own database — otherwise one file's cleanup would delete another
 * file's fixtures mid-test.
 */
const baseUri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017';
const fileSlug = path.basename(process.argv[1] || 'all').replace(/\.test\.js$/, '').replace(/[^a-zA-Z0-9_]/g, '_');

export const TEST_MONGO_URI = `${baseUri}/spendwise_test_${fileSlug}`;

export async function setupDatabase() {
  await connectDatabase(TEST_MONGO_URI);
  await mongoose.connection.dropDatabase();
}

export async function teardownDatabase() {
  await mongoose.connection.dropDatabase();
  await disconnectDatabase();
}

export async function clearCollections() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
}

/** Creates a user directly (the model hashes the password on save). */
export async function createUser(overrides = {}) {
  return User.create({
    name: 'Test User',
    email: `user-${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    ...overrides,
  });
}

/**
 * Registers a user through the API and returns the session cookie header.
 * The agent keeps the cookie jar so later requests stay authenticated.
 */
export async function registerAndLogin(app, overrides = {}) {
  const payload = {
    name: 'Test User',
    email: `user-${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    ...overrides,
  };

  const agent = request.agent(app);
  const response = await agent.post('/api/auth/register').send(payload);

  return { agent, user: response.body.data.user, payload };
}

/** Returns the first category of a given type for a user. */
export async function firstCategory(userId, type = 'EXPENSE') {
  return Category.findOne({ userId, type });
}
