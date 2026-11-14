
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in your .env file");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`ResolveIt backend running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
