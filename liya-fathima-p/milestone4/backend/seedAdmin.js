
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { readData, writeData } = require("./utils/fileHandler");

const users = readData("users.json");

const adminEmail = "admin@resolveit.com";

const existingAdmin = users.find(
  (user) => user.email === adminEmail
);

if (existingAdmin) {
  console.log("Admin account already exists.");
  process.exit(0);
}

const admin = {
  id: "ADMIN001",
  name: "ResolveIt Admin",
  email: adminEmail,
  password: bcrypt.hashSync("Admin@123", 10),
  role: "admin",
  isActive: true,
  createdAt: new Date().toISOString()
};

users.push(admin);
writeData("users.json", users);

console.log("Admin account created successfully.");
console.log("Email: admin@resolveit.com");
console.log("Password: Admin@123");
