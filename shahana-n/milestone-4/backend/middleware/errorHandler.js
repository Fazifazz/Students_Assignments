export default function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode || (error.type === 'entity.parse.failed' ? 400 : 500);
  const message = statusCode >= 500 ? 'An unexpected server error occurred.' : error.message;
  if (statusCode >= 500) console.error(error);
  response.status(statusCode).json({ message });
}
