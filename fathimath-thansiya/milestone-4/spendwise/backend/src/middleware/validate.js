import ApiError from '../utils/ApiError.js';

/**
 * Validates and coerces a request segment against a Zod schema.
 * The parsed (and sanitised) value replaces the raw input, so controllers
 * only ever see validated data.
 */
export default function validate(schema, source = 'body') {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }
    // `req.query` is a getter-only property on Express 5; assign to a
    // parallel property when validating query strings.
    if (source === 'query') {
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }
    return next();
  };
}
