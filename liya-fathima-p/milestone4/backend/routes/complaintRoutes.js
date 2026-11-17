
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { uploadAttachments } = require("../middleware/attachmentUpload");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  cancelComplaint,
  addComment,
  getAttachment
} = require("../controllers/complaintController");

router.use(protect);

router.post("/", uploadAttachments, createComplaint);
router.get("/:id/attachments/:attachmentId", getAttachment);
router.get("/", getComplaints);
router.get("/:id", getComplaintById);
router.post("/:id/comments", addComment);

router.patch(
  "/:id/status",
  allowRoles("admin"),
  updateComplaintStatus
);

router.delete("/:id", cancelComplaint);

module.exports = router;
