// src/utils/dateUtils.js

export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getDaysRemaining = (deadlineStr) => {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDeadlineStatus = (deadlineStr) => {
  const days = getDaysRemaining(deadlineStr);
  if (days === null) return { text: 'No deadline', color: 'slate', isUrgent: false };
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, color: 'rose', isUrgent: true };
  if (days === 0) return { text: 'Due today', color: 'amber', isUrgent: true };
  if (days === 1) return { text: 'Due tomorrow', color: 'amber', isUrgent: true };
  if (days <= 7) return { text: `${days} days left`, color: 'orange', isUrgent: true };
  return { text: `${days} days left`, color: 'emerald', isUrgent: false };
};

export const formatMinutesToHours = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours === 0) return `${remainingMins}m`;
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}m`;
};
