import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  changePassword as changePasswordRequest,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from '../../services/api/auth';
import { AuthContext } from './auth-context';

/**
 * Authentication state.
 *
 * The JWT lives in an HTTP-only cookie owned by the backend — nothing
 * sensitive is written to localStorage or JavaScript-accessible storage.
 * The session is restored on boot with a single `GET /auth/me`.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    fetchCurrentUser()
      .then((currentUser) => {
        if (!active) return;
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus('anonymous');
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (credentials) => {
      const result = await loginRequest(credentials);
      setUser(result.user);
      setStatus('authenticated');
      queryClient.clear();
      return result.user;
    },
    [queryClient],
  );

  const register = useCallback(
    async (payload) => {
      const result = await registerRequest(payload);
      setUser(result.user);
      setStatus('authenticated');
      queryClient.clear();
      return result.user;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus('anonymous');
      queryClient.clear();
    }
  }, [queryClient]);

  const updateProfile = useCallback(async (payload) => {
    const result = await updateProfileRequest(payload);
    setUser(result.user);
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    return result.user;
  }, [queryClient]);

  const changePassword = useCallback(
    async (payload) => {
      await changePasswordRequest(payload);
      // The backend clears the session cookie, so the user signs in again.
      setUser(null);
      setStatus('anonymous');
      queryClient.clear();
    },
    [queryClient],
  );

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, status, login, register, logout, updateProfile, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
