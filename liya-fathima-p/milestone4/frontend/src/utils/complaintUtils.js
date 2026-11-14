export function isOverdue(complaint, now = Date.now()) {
  const status = String(complaint?.status || '').toLowerCase()
  const closed = status === 'resolved' || status === 'rejected'
  const dueTime = Date.parse(complaint?.dueAt)
  return !closed && Number.isFinite(dueTime) && dueTime < now
}
