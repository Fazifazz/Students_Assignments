
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getDashboard,
  getUsers,
  updateUserStatus,
  getReports
} = require("../controllers/adminController");

router.use(protect, allowRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.get("/reports", getReports);

module.exports = router;
