
const jwt = require("jsonwebtoken");
const { readData } = require("../utils/fileHandler");

function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = readData("users.json");
    const user = users.find(
      (item) => item.id === decoded.id && item.isActive !== false
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or account is inactive"
      });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

module.exports = protect;
