export function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export function notFoundError(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

export function conflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}

export function validateId(id, label = 'ID') {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)) {
    throw badRequest(`${label} is invalid.`);
  }
}

export function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw badRequest('Request body must be a JSON object.');
  }
}

export function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw badRequest(`${label} is required.`);
  }
  return value.trim();
}

export function integerInRange(value, label, min, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw badRequest(`${label} must be a whole number between ${min} and ${max}.`);
  }
  return number;
}

export function optionalText(value, label, maxLength = 5000) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' || value.length > maxLength) {
    throw badRequest(`${label} must be text no longer than ${maxLength} characters.`);
  }
  return value.trim();
}
