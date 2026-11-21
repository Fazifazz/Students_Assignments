# SpendWise — Backend

Node.js + Express REST API with MongoDB (Mongoose), JWT authentication in HTTP-only
cookies, Zod validation and centralised error handling.

## Scripts

```bash
npm run dev     # nodemon, reloads on change
npm start       # production start
npm run seed    # load the demo account with six months of activity
npm run lint    # ESLint
npm test        # node:test + supertest against a real MongoDB database
```

## Environment

Copy `.env.example` to `.env`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `5000` |
| `NODE_ENV` | `development` / `production` | `development` |
| `MONGODB_URI` | MongoDB Atlas / local connection string | `mongodb://127.0.0.1:27017/spendwise` |
| `JWT_SECRET` | Signing secret for auth tokens | dev-only fallback |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `COOKIE_NAME` | Auth cookie name | `spendwise_token` |
| `RESET_TOKEN_TTL_MINUTES` | Password reset link lifetime | `60` |
| `CLIENT_ORIGIN` | Comma-separated CORS allowlist | `http://localhost:5173` |
| `FRONTEND_URL` | Used to build password reset links | `http://localhost:5173` |
| `SMTP_*` | Optional password reset email transport | blank |

In production the app refuses to boot without `MONGODB_URI` and `JWT_SECRET`.

## Structure

```
src/
├── config/       environment configuration, database connection
├── controllers/  thin HTTP layer — read validated input, call one service, respond
├── models/       Mongoose schemas with indexes and validation
├── routes/       one Express router per resource
├── services/     business logic, aggregation pipelines, insight rules
├── middleware/   auth, request validation, error handling
├── validators/   Zod schemas per resource
├── utils/        ApiError, response envelope, async handler, default categories
├── scripts/      demo data seeder
├── app.js        Express app factory (importable without opening a port)
└── server.js     DB connection + listen + graceful shutdown
```

## API conventions

Envelope: `{ success: true, data }` on success, `{ success: false, error: { message, details? } }`
on failure. All money is integer paise. Every query is scoped by the authenticated user's
id — the client never supplies a user id.

Full reference: [`../docs/API.md`](../docs/API.md).

## Security baseline

- `helmet` for security headers, `cors` allowlist with credentials
- `cookie-parser` + `express-rate-limit` (10 / 15 min on credential endpoints, 500 / 15 min
  across the API)
- `httpOnly`, `secure` in production, `sameSite` per environment auth cookies
- Errors return a safe `{ success: false, error: { message } }` envelope; stack traces never
  reach the client
- Passwords are hashed with bcrypt (12 rounds) and the hash is `select: false`
- Password reset uses a SHA-256 hashed, expiring token; the raw token is never stored

## Tests

```bash
TEST_MONGODB_URI="mongodb://127.0.0.1:27017" npm test
```

35 tests. Each test file gets its own database (derived from the file name) because
Node's test runner executes files in parallel — sharing one database would let one file's
cleanup delete another file's fixtures mid-test.
