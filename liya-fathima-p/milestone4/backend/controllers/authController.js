
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readData, writeData } = require("../utils/fileHandler");
const generateId = require("../utils/generateId");

function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters"
    });
  }

  const users = readData("users.json");
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists"
    });
  }

  const user = {
    id: generateId("USER"),
    name: name.trim(),
    email: normalizedEmail,
    password: bcrypt.hashSync(password, 10),
    role: "user",
    isActive: true,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeData("users.json", users);

  const token = createToken(user);
  const { password: hiddenPassword, ...safeUser } = user;

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: safeUser
  });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const users = readData("users.json");
  const user = users.find(
    (item) => item.email === email.trim().toLowerCase()
  );

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  if (user.isActive === false) {
    return res.status(403).json({
      success: false,
      message: "Your account has been deactivated"
    });
  }

  const token = createToken(user);
  const { password: hiddenPassword, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: safeUser
  });
}

function getMe(req, res) {
  res.status(200).json({
    success: true,
    user: req.user
  });
}

module.exports = { register, login, getMe };
