import app from './app.js';
import env from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

async function start() {
  try {
    await connectDatabase();
    console.log('[spendwise] MongoDB connected');

    const server = app.listen(env.port, () => {
      console.log(`[spendwise] API listening on http://localhost:${env.port} (${env.nodeEnv})`);
    });

    const shutdown = (signal) => {
      console.log(`[spendwise] ${signal} received, shutting down`);
      server.close(() =>
        disconnectDatabase().finally(() => process.exit(0)),
      );
      // Force exit if connections hang during shutdown.
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[spendwise] Failed to start:', error.message);
    process.exit(1);
  }
}

start();
