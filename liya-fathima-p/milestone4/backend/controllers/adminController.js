
const { readData, writeData } = require("../utils/fileHandler");
const { isOverdue, toPublicComplaint } = require("./complaintController");

function getDashboard(req, res) {
  const complaints = readData("complaints.json");
  const users = readData("users.json");
  const departments = readData("departments.json");

  const countByStatus = (status) =>
    complaints.filter((item) => item.status === status).length;

  const categoryStats = {};

  complaints.forEach((item) => {
    categoryStats[item.category] =
      (categoryStats[item.category] || 0) + 1;
  });

  const overdueComplaints = complaints
    .filter((item) => isOverdue(item))
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
    .map((item) => {
      const user = users.find((entry) => entry.id === item.userId);
      return {
        ...toPublicComplaint(item),
        user: user
          ? { id: user.id, name: user.name, email: user.email }
          : null,
        department:
          departments.find((department) => department.id === item.departmentId) || null
      };
    });

  res.status(200).json({
    success: true,
    stats: {
      totalComplaints: complaints.length,
      pending: countByStatus("Pending"),
      underReview: countByStatus("Under Review"),
      inProgress: countByStatus("In Progress"),
      resolved: countByStatus("Resolved"),
      rejected: countByStatus("Rejected"),
      overdue: overdueComplaints.length,
      totalUsers: users.filter((item) => item.role === "user").length
    },
    categoryStats,
    overdueComplaints: overdueComplaints.slice(0, 5),
    recentComplaints: complaints
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  });
}

function getUsers(req, res) {
  const users = readData("users.json");

  const safeUsers = users.map(({ password, ...user }) => user);

  res.status(200).json({
    success: true,
    count: safeUsers.length,
    users: safeUsers
  });
}

function updateUserStatus(req, res) {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be true or false"
    });
  }

  const users = readData("users.json");
  const user = users.find((item) => item.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (user.role === "admin") {
    return res.status(400).json({
      success: false,
      message: "Admin account status cannot be changed here"
    });
  }

  user.isActive = isActive;
  writeData("users.json", users);

  const { password, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    user: safeUser
  });
}

function getReports(req, res) {
  const complaints = readData("complaints.json");

  const byCategory = {};
  const byStatus = {};

  complaints.forEach((item) => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    total: complaints.length,
    pending: byStatus.Pending || 0,
    underReview: byStatus["Under Review"] || 0,
    inProgress: byStatus["In Progress"] || 0,
    resolved: byStatus.Resolved || 0,
    rejected: byStatus.Rejected || 0,
    overdue: complaints.filter((item) => isOverdue(item)).length,
    byCategory,
    byStatus
  });
}

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  getReports
};
