import mongoose from 'mongoose';
import env from './env.js';

/**
 * Opens the MongoDB connection.
 * `serverSelectionTimeoutMS` is kept short so a misconfigured connection
 * string fails fast with a clear message instead of hanging the boot.
 *
 * @param {string} [uri] Overrides the configured connection string (used by
 *   the test suite to give every test file its own database).
 */
export async function connectDatabase(uri = env.mongoUri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  });
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.connection.close(false);
}

export default connectDatabase;
