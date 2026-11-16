import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { doctors as seedDoctors } from '../data/doctors.js'

const STORAGE_KEY = 'medibook_doctors'
const DoctorsContext = createContext(null)
const seedDoctorsById = new Map(seedDoctors.map((doctor) => [doctor.id, doctor]))

function normalizeSavedDoctor(doctor) {
  const seedDoctor = seedDoctorsById.get(doctor.id)
  const legacyEmail = `${doctor.id}@medibook.demo`
  const email = !doctor.email || doctor.email.toLowerCase() === legacyEmail
    ? seedDoctor?.email || legacyEmail
    : doctor.email

  return {
    ...doctor,
    email,
    isActive: doctor.isActive !== false,
  }
}

function getInitialDoctors() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return seedDoctors.map((doctor) => ({
      ...doctor,
      isActive: true,
    }))
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      console.warn('Saved MediBook doctor data was not a list; restoring fictional seed doctors.')
      return seedDoctors.map((doctor) => ({ ...doctor, isActive: true }))
    }
    return parsed.filter((doctor) =>
      doctor && typeof doctor.id === 'string' && typeof doctor.name === 'string' &&
      Array.isArray(doctor.availableDays) && Array.isArray(doctor.timeSlots),
    ).map(normalizeSavedDoctor)
  } catch (error) {
    console.warn('Unable to read saved MediBook doctors.', error)
    return seedDoctors.map((doctor) => ({ ...doctor, isActive: true }))
  }
}

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useState(getInitialDoctors)
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors))
      setStorageError('')
    } catch (error) {
      console.error('Unable to save MediBook doctor records.', error)
      setStorageError('Doctor data could not be saved in this browser. Changes may not persist after refresh.')
    }
  }, [doctors])

  const updateDoctor = useCallback((id, changes) => {
    setDoctors((current) => current.map((doctor) =>
      doctor.id === id ? { ...doctor, ...changes } : doctor,
    ))
  }, [])

  const addDoctor = useCallback((doctor) => {
    const duplicate = doctors.some((saved) =>
      saved.id === doctor.id || saved.email.toLowerCase() === doctor.email.toLowerCase(),
    )
    if (duplicate) return false
    setDoctors((current) => [...current, { ...doctor, isActive: true }])
    return true
  }, [doctors])

  const deactivateDoctor = useCallback((id) => {
    updateDoctor(id, { isActive: false })
  }, [updateDoctor])

  const value = useMemo(
    () => ({ doctors, updateDoctor, addDoctor, deactivateDoctor, storageError }),
    [doctors, updateDoctor, addDoctor, deactivateDoctor, storageError],
  )
  return createElement(DoctorsContext.Provider, { value }, children)
}

export function useDoctors() {
  const context = useContext(DoctorsContext)
  if (!context) throw new Error('useDoctors must be used within a DoctorsProvider.')
  return context
}
