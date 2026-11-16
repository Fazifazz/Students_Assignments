import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { demoUsers } from '../data/demoUsers.js'
import { useDoctors } from '../hooks/useDoctors.js'

const USERS_KEY = 'medibook_patients'
const SESSION_KEY = 'medibook_session'
const AuthContext = createContext(null)

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.warn(`Unable to read ${key}; using demo defaults.`, error)
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ${key}.`, error)
    throw new Error('This change could not be saved in browser storage. Please check available storage and try again.', { cause: error })
  }
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const { doctors } = useDoctors()
  const [patients, setPatients] = useState(() => {
    const saved = readJson(USERS_KEY, [])
    return Array.isArray(saved) ? saved.filter((user) =>
      user && typeof user.id === 'string' && typeof user.email === 'string' &&
      typeof user.passwordHash === 'string' && typeof user.name === 'string',
    ) : []
  })
  const [session, setSession] = useState(() => {
    const saved = readJson(SESSION_KEY, null)
    return saved && ['patient', 'doctor', 'admin'].includes(saved.role) && typeof saved.id === 'string'
      ? saved
      : null
  })
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(patients))
    } catch (error) {
      console.error('Unable to save demo patient accounts.', error)
      setStorageError('Account information could not be saved in this browser.')
    }
  }, [patients])

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      else localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Unable to save demo session.', error)
      setStorageError('Your demo session could not be saved in this browser.')
    }
  }, [session])

  const user = useMemo(() => {
    if (!session) return null
    if (session.role === 'patient') {
      const patient = patients.find((item) => item.id === session.id && item.isActive !== false)
      if (!patient) return null
      const { passwordHash, ...safePatient } = patient
      return { ...safePatient, role: 'patient' }
    }
    const demoUser = session.role === 'doctor'
      ? doctors.find((item) => item.id === session.id && item.isActive !== false)
      : demoUsers.find((item) => item.id === session.id && item.role === session.role)
    if (!demoUser) return null
    const { passwordHash, ...safeDemoUser } = demoUser
    return { ...safeDemoUser, role: session.role }
  }, [patients, session, doctors])

  useEffect(() => {
    if (session && !user) setSession(null)
  }, [session, user])

  const registerPatient = useCallback(async ({ name, email, phone, password, gender = '', dateOfBirth = '' }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (patients.some((patient) => patient.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const patient = {
      id: globalThis.crypto?.randomUUID?.() ?? `patient-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      gender,
      dateOfBirth,
      passwordHash: await hashPassword(password),
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    const nextPatients = [...patients, patient]
    writeJson(USERS_KEY, nextPatients)
    setPatients(nextPatients)
    return { ok: true }
  }, [patients])

  const login = useCallback(async (email, password, requestedRole = 'patient') => {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await hashPassword(password)
    let account
    if (requestedRole === 'patient') {
      account = patients.find((patient) =>
        patient.email.toLowerCase() === normalizedEmail &&
        patient.passwordHash === passwordHash &&
        patient.isActive !== false,
      )
    } else if (requestedRole === 'doctor') {
      account = doctors.find((doctor) =>
        doctor.email?.toLowerCase() === normalizedEmail &&
        doctor.isActive !== false &&
        passwordHash === '2a636164f2b0a0e4db86e7bd513f535e5e1b310008d3d6b7ba55f41332eb7dcc',
      )
    } else {
      account = demoUsers.find((demoUser) =>
        demoUser.email === normalizedEmail &&
        demoUser.role === requestedRole &&
        demoUser.passwordHash === passwordHash,
      )
    }
    if (!account) return { ok: false, error: 'Email, password, or account type is incorrect.' }
    const nextSession = { id: account.id, role: requestedRole }
    writeJson(SESSION_KEY, nextSession)
    setSession(nextSession)
    return { ok: true, user: account }
  }, [patients, doctors])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY)
      setSession(null)
    } catch (error) {
      console.error('Unable to clear the MediBook demo session.', error)
      setStorageError('Your session could not be cleared from this browser.')
    }
  }, [])
  const deactivatePatient = useCallback((id) => {
    const nextPatients = patients.map((patient) =>
      patient.id === id ? { ...patient, isActive: false } : patient,
    )
    writeJson(USERS_KEY, nextPatients)
    setPatients(nextPatients)
  }, [patients])

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    patients,
    storageError,
    login,
    logout,
    registerPatient,
    deactivatePatient,
  }), [user, patients, storageError, login, logout, registerPatient, deactivatePatient])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
