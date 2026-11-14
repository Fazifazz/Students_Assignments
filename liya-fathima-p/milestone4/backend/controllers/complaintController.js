
const fs = require("fs");
const path = require("path");
const { readData, writeData } = require("../utils/fileHandler");
const generateId = require("../utils/generateId");
const { removeFiles, uploadDirectory } = require("../middleware/attachmentUpload");

function addNotification(userId, message, complaintId) {
  const notifications = readData("notifications.json");

  notifications.push({
    id: generateId("NOT"),
    userId,
    message,
    complaintId,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeData("notifications.json", notifications);
}

function toPublicComplaint(complaint) {
  return {
    ...complaint,
    attachments: (complaint.attachments || []).map(({ storageName, ...item }) => item)
  };
}

function includeAdminDetails(complaint, users, departments) {
  const user = users.find((item) => item.id === complaint.userId);

  return {
    ...toPublicComplaint(complaint),
    user: user
      ? { id: user.id, name: user.name, email: user.email }
      : null,
    department:
      departments.find((item) => item.id === complaint.departmentId) || null
  };
}

function getAttachmentMetadata(file) {
  return {
    id: generateId("ATT"),
    name: path.basename(file.originalname).replace(/[\r\n]/g, "").slice(0, 120),
    mimeType: file.mimetype,
    size: file.size,
    storageName: file.filename,
    createdAt: new Date().toISOString()
  };
}

function isOverdue(complaint, now = Date.now()) {
  const status = String(complaint.status || "").toLowerCase();
  const closed = status === "resolved" || status === "rejected";
  const dueTime = Date.parse(complaint.dueAt);
  return !closed && Number.isFinite(dueTime) && dueTime < now;
}

function createComplaint(req, res) {
  const {
    title,
    category,
    description,
    location,
    priority,
    contact,
    contactNumber
  } = req.body;

  if (!title || !category || !description || !location) {
    removeFiles(req.files);
    return res.status(400).json({
      success: false,
      message: "Title, category, description and location are required"
    });
  }

  const complaint = {
    id: generateId("CMP"),
    userId: req.user.id,
    title: title.trim(),
    category,
    description: description.trim(),
    location: location.trim(),
    priority: priority || "Medium",
    contact: contact || contactNumber || "",
    status: "Pending",
    departmentId: null,
    adminResponse: "",
    attachments: (req.files || []).map(getAttachmentMetadata),
    comments: [],
    history: [
      {
        status: "Pending",
        note: "Complaint submitted",
        date: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const complaints = readData("complaints.json");
  complaints.push(complaint);
  writeData("complaints.json", complaints);

  addNotification(
    req.user.id,
    `Your complaint "${complaint.title}" has been submitted`,
    complaint.id
  );

  res.status(201).json({
    success: true,
    message: "Complaint submitted successfully",
    complaint: toPublicComplaint(complaint)
  });
}

function getComplaints(req, res) {
  let complaints = readData("complaints.json");

  if (req.user.role === "admin") {
    const users = readData("users.json");
    const departments = readData("departments.json");
    complaints = complaints.map((item) =>
      includeAdminDetails(item, users, departments)
    );
  } else {
    complaints = complaints.filter(
      (item) => item.userId === req.user.id
    ).map(toPublicComplaint);
  }

  const { status, category, search } = req.query;

  if (status) {
    complaints = complaints.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (category) {
    complaints = complaints.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const term = search.toLowerCase();
    complaints = complaints.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
    );
  }

  complaints.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints
  });
}

function getComplaintById(req, res) {
  const complaints = readData("complaints.json");
  let complaint = complaints.find((item) => item.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  if (req.user.role !== "admin" && complaint.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You cannot view this complaint"
    });
  }

  if (req.user.role === "admin") {
    complaint = includeAdminDetails(
      complaint,
      readData("users.json"),
      readData("departments.json")
    );
  } else {
    complaint = toPublicComplaint(complaint);
  }

  res.status(200).json({ success: true, complaint });
}

function updateComplaintStatus(req, res) {
  const { status, adminResponse, departmentId, priority, dueAt } = req.body;
  const allowedStatuses = [
    "Pending",
    "Under Review",
    "In Progress",
    "Resolved",
    "Rejected"
  ];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid complaint status"
    });
  }

  const allowedPriorities = ["Low", "Medium", "High", "Urgent"];
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: "Invalid complaint priority"
    });
  }

  if (adminResponse !== undefined && typeof adminResponse !== "string") {
    return res.status(400).json({
      success: false,
      message: "Resolution note must be text"
    });
  }

  if (
    departmentId !== undefined &&
    departmentId !== null &&
    typeof departmentId !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid department"
    });
  }

  if (
    dueAt !== undefined &&
    dueAt !== null &&
    dueAt !== "" &&
    (typeof dueAt !== "string" || !Number.isFinite(Date.parse(dueAt)))
  ) {
    return res.status(400).json({
      success: false,
      message: "Due date must be a valid date"
    });
  }

  if (
    status === undefined &&
    adminResponse === undefined &&
    departmentId === undefined &&
    priority === undefined &&
    dueAt === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one complaint field must be updated"
    });
  }

  const complaints = readData("complaints.json");
  const index = complaints.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  const complaint = complaints[index];
  const oldStatus = complaint.status;
  const departments = readData("departments.json");
  const historyNotes = [];
  let statusChanged = false;

  if (status !== undefined && status !== oldStatus) {
    complaint.status = status;
    statusChanged = true;
    historyNotes.push(`Status changed from ${oldStatus} to ${status}`);
  }

  if (status === undefined) {
    complaint.status = oldStatus;
  }

  if (adminResponse !== undefined && adminResponse !== complaint.adminResponse) {
    complaint.adminResponse = adminResponse.trim();
    historyNotes.push(
      complaint.adminResponse
        ? `Resolution note: ${complaint.adminResponse}`
        : "Resolution note cleared"
    );
  }

  if (departmentId !== undefined) {
    const nextDepartmentId = departmentId || null;
    if (nextDepartmentId !== complaint.departmentId) {
      if (
        nextDepartmentId &&
        !departments.some((item) => item.id === nextDepartmentId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Department not found"
        });
      }

      complaint.departmentId = nextDepartmentId;
      const department = nextDepartmentId
        ? departments.find((item) => item.id === nextDepartmentId)
        : null;
      historyNotes.push(
        department
          ? `Assigned to ${department.name}`
          : "Department assignment removed"
      );
    }
  }

  if (priority !== undefined && priority !== complaint.priority) {
    complaint.priority = priority;
    historyNotes.push(`Priority changed to ${priority}`);
  }

  if (dueAt !== undefined) {
    const nextDueAt = dueAt ? new Date(dueAt).toISOString() : null;
    if (nextDueAt !== (complaint.dueAt || null)) {
      complaint.dueAt = nextDueAt;
      historyNotes.push(
        nextDueAt
          ? `Due date set to ${new Date(nextDueAt).toLocaleDateString()}`
          : "Due date removed"
      );
    }
  }

  if (historyNotes.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Complaint is already up to date",
      complaint:
        req.user.role === "admin"
          ? includeAdminDetails(
            complaint,
            readData("users.json"),
            departments
          )
          : toPublicComplaint(complaint)
    });
  }

  complaint.updatedAt = new Date().toISOString();
  complaint.history = complaint.history || [];
  complaint.history.push({
    status: complaint.status,
    note: historyNotes.join("; "),
    date: complaint.updatedAt,
    userId: req.user.id,
    role: req.user.role
  });

  complaints[index] = complaint;
  writeData("complaints.json", complaints);

  addNotification(
    complaint.userId,
    statusChanged
      ? `Your complaint "${complaint.title}" is now ${complaint.status}`
      : `Your complaint "${complaint.title}" has been updated`,
    complaint.id
  );

  res.status(200).json({
    success: true,
    message: "Complaint updated successfully",
    complaint: includeAdminDetails(
      complaint,
      readData("users.json"),
      departments
    )
  });
}

function cancelComplaint(req, res) {
  const complaints = readData("complaints.json");
  const index = complaints.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  const complaint = complaints[index];

  if (complaint.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You cannot cancel this complaint"
    });
  }

  if (complaint.status !== "Pending") {
    return res.status(400).json({
      success: false,
      message: "Only pending complaints can be cancelled"
    });
  }

  complaints.splice(index, 1);
  writeData("complaints.json", complaints);
  (complaint.attachments || []).forEach((attachment) => {
    const storageName = attachment.storageName;
    if (/^[a-f0-9]{32}\.(jpg|png|webp|pdf)$/.test(storageName || "")) {
      const filePath = path.join(uploadDirectory, storageName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  res.status(200).json({
    success: true,
    message: "Complaint cancelled successfully"
  });
}

function getAttachment(req, res) {
  const complaints = readData("complaints.json");
  const complaint = complaints.find((item) => item.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  if (req.user.role !== "admin" && complaint.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You cannot access this attachment"
    });
  }

  const attachment = (complaint.attachments || []).find(
    (item) => item.id === req.params.attachmentId
  );
  if (
    !attachment ||
    !/^[a-f0-9]{32}\.(jpg|png|webp|pdf)$/.test(attachment.storageName || "")
  ) {
    return res.status(404).json({
      success: false,
      message: "Attachment not found"
    });
  }

  const filePath = path.join(uploadDirectory, attachment.storageName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Attachment file is unavailable"
    });
  }

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.download(filePath, attachment.name, (error) => {
    if (error && !res.headersSent) {
      res.status(404).json({
        success: false,
        message: "Attachment file is unavailable"
      });
    }
  });
}

function addComment(req, res) {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Comment cannot be empty"
    });
  }

  const complaints = readData("complaints.json");
  const complaint = complaints.find((item) => item.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  if (req.user.role !== "admin" && complaint.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You cannot comment on this complaint"
    });
  }

  complaint.comments.push({
    id: generateId("COM"),
    userId: req.user.id,
    name: req.user.name,
    role: req.user.role,
    message: message.trim(),
    createdAt: new Date().toISOString()
  });

  complaint.updatedAt = new Date().toISOString();
  writeData("complaints.json", complaints);

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comments: complaint.comments
  });
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  cancelComplaint,
  addComment,
  getAttachment,
  isOverdue,
  toPublicComplaint
};
