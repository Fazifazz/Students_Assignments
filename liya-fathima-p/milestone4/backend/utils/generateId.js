
const crypto = require("crypto");

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}

module.exports = generateId;
