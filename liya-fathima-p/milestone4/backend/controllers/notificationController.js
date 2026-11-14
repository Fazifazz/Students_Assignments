
const { readData, writeData } = require("../utils/fileHandler");

function getNotifications(req, res) {
  const notifications = readData("notifications.json");

  const userNotifications = notifications
    .filter((item) => item.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    notifications: userNotifications
  });
}

function markAsRead(req, res) {
  const notifications = readData("notifications.json");

  const notification = notifications.find(
    (item) =>
      item.id === req.params.id && item.userId === req.user.id
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found"
    });
  }

  notification.isRead = true;
  writeData("notifications.json", notifications);

  res.status(200).json({
    success: true,
    message: "Notification marked as read"
  });
}

function markAllAsRead(req, res) {
  const notifications = readData("notifications.json");

  notifications.forEach((item) => {
    if (item.userId === req.user.id) {
      item.isRead = true;
    }
  });

  writeData("notifications.json", notifications);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read"
  });
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
