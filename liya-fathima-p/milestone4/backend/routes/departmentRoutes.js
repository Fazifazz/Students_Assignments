
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

router.get("/", protect, getDepartments);
router.post("/", protect, allowRoles("admin"), createDepartment);
router.put("/:id", protect, allowRoles("admin"), updateDepartment);
router.delete("/:id", protect, allowRoles("admin"), deleteDepartment);

module.exports = router;
