/**
 * Consistent API envelope helpers.
 * Every endpoint answers with `{ success: true, data }` or the error handler's
 * `{ success: false, error: { message, details? } }`.
 */
export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendCreated(res, data) {
  return sendSuccess(res, data, 201);
}

export function sendMessage(res, message, status = 200) {
  return res.status(status).json({ success: true, data: { message } });
}
