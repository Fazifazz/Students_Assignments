/**
 * Runtime configuration for the frontend.
 *
 * Only non-sensitive values belong here — never a database URI, JWT secret
 * or any other server credential.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  isDev: import.meta.env.DEV,
};

export default env;
