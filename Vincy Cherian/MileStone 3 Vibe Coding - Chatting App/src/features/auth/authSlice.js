import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: '',
  loading: false,
};

const mockUsers = [
  {
    id: 'u1',
    name: 'Aisha Nair',
    email: 'aisha@chatnest.app',
    password: 'demo123',
    status: 'Designing the next chat idea',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u2',
    name: 'Maya Das',
    email: 'maya@chatnest.app',
    password: 'demo123',
    status: 'Available for a quick call',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
  },
];

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const match = mockUsers.find(
        (user) => user.email.toLowerCase() === String(email).trim().toLowerCase() && user.password === password,
      );

      if (!match) {
        state.error = 'Invalid email or password for the demo account.';
        state.isAuthenticated = false;
        state.user = null;
        return;
      }

      const safeUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        status: match.status,
        avatar: match.avatar,
      };

      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = '';
      state.loading = false;
    },
    register: (state, action) => {
      const { name, email, password } = action.payload;
      const cleanedEmail = String(email).trim().toLowerCase();
      const existing = mockUsers.some((user) => user.email.toLowerCase() === cleanedEmail);

      if (!name || !cleanedEmail || !password) {
        state.error = 'Please fill out all fields to create your account.';
        state.isAuthenticated = false;
        state.user = null;
        return;
      }

      if (existing) {
        state.error = 'An account already exists with that email.';
        state.isAuthenticated = false;
        state.user = null;
        return;
      }

      const newUser = {
        id: `u${Date.now()}`,
        name,
        email: cleanedEmail,
        password,
        status: 'New ChatNest member',
        avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=200&q=80',
      };

      mockUsers.push(newUser);
      state.user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        avatar: newUser.avatar,
      };
      state.isAuthenticated = true;
      state.error = '';
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = '';
    },
    updateProfile: (state, action) => {
      if (!state.user) return;

      const { name, status, avatar } = action.payload;
      state.user = {
        ...state.user,
        name: name || state.user.name,
        status: status || state.user.status,
        avatar: avatar || state.user.avatar,
      };
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { login, register, logout, updateProfile, setAuthError } = authSlice.actions;
export default authSlice.reducer;
