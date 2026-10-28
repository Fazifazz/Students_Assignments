import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  isAuthenticated: boolean
  username: string | null
  displayName: string
  email: string
  profileImage: string | null
  error: string | null
  profileStorageError: string | null
}

const profileStorageKey = 'ledgerly.profile.v1'

function readProfile(): {
  displayName: string
  email: string
  profileImage: string | null
  profileStorageError: string | null
} {
  try {
    const serialized = window.localStorage.getItem(profileStorageKey)
    if (serialized === null) {
      return { displayName: 'Faith', email: '', profileImage: null, profileStorageError: null }
    }
    const value: unknown = JSON.parse(serialized)
    if (
      typeof value === 'object' &&
      value !== null &&
      'displayName' in value &&
      typeof value.displayName === 'string' &&
      'email' in value &&
      typeof value.email === 'string' &&
      (!('profileImage' in value) ||
        value.profileImage === null ||
        (typeof value.profileImage === 'string' &&
          /^data:image\/(?:jpeg|png|webp);base64,/.test(value.profileImage))) &&
      value.displayName.trim() !== ''
    ) {
      return {
        displayName: value.displayName,
        email: value.email,
        profileImage:
          'profileImage' in value && typeof value.profileImage === 'string'
            ? value.profileImage
            : null,
        profileStorageError: null,
      }
    }
    throw new Error('Saved profile data has an unexpected format.')
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Browser storage is unavailable.'
    return {
      displayName: 'Faith',
      email: '',
      profileImage: null,
      profileStorageError: `Could not read saved profile data. ${detail}`,
    }
  }
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  ...readProfile(),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAttempt(state, action: PayloadAction<{ username: string; password: string }>) {
      const { username, password } = action.payload
      if (username.trim() === 'faith' && password === '123') {
        state.isAuthenticated = true
        state.username = 'faith'
        state.error = null
        return
      }
      state.isAuthenticated = false
      state.username = null
      state.error = 'That username and password do not match.'
    },
    updateProfile(
      state,
      action: PayloadAction<{ displayName: string; email: string; profileImage: string | null }>,
    ) {
      state.displayName = action.payload.displayName
      state.email = action.payload.email
      state.profileImage = action.payload.profileImage
      state.profileStorageError = null
    },
    setProfileStorageError(state, action: PayloadAction<string>) {
      state.profileStorageError = action.payload
    },
    clearProfileStorageError(state) {
      state.profileStorageError = null
    },
    logout(state) {
      state.isAuthenticated = false
      state.username = null
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
})

export const {
  loginAttempt,
  updateProfile,
  setProfileStorageError,
  clearProfileStorageError,
  logout,
  clearAuthError,
} = authSlice.actions
export default authSlice.reducer

export const profileStorage = profileStorageKey
