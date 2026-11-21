import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised environment configuration.
 *
 * Missing critical values fail fast in production rather than silently
 * defaulting to insecure values.
 */
const required = ['MONGODB_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV === 'production') {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const toList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendwise',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'spendwise_token',
  clientOrigins: toList(process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  resetTokenTtlMinutes: Number(process.env.RESET_TOKEN_TTL_MINUTES || 60),
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'no-reply@spendwise.local',
  },
};

export default env;
