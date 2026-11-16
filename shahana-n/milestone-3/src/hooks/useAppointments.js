import { useCallback, useEffect, useRef, useState } from 'react'
import { isAppointmentPast } from '../utils/validation.js'

const STORAGE_KEY = 'medibook_appointments'

function isStoredAppointment(appointment) {
  return Boolean(
    appointment &&
    typeof appointment.id === 'string' &&
    typeof appointment.patientName === 'string' &&
    typeof appointment.email === 'string' &&
    typeof appointment.phone === 'string' &&
    typeof appointment.doctorId === 'string' &&
    typeof appointment.appointmentDate === 'string' &&
    typeof appointment.timeSlot === 'string' &&
    (appointment.reason === undefined || typeof appointment.reason === 'string') &&
    ['Confirmed', 'Cancelled', 'Completed'].includes(appointment.status),
  )
}

function readAppointments() {
  let stored
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.error('Unable to read MediBook appointments from localStorage.', error)
    return []
  }
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredAppointment)
  } catch (error) {
    console.warn('MediBook appointment data was invalid and has been reset.', error)
    return []
  }
}

function saveAppointments(appointments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  } catch (error) {
    console.error('Unable to save MediBook appointments to localStorage.', error)
    throw new Error('Appointment changes could not be saved. Check browser storage availability and try again.', { cause: error })
  }
}

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const appointmentsRef = useRef([])

  useEffect(() => {
    const savedAppointments = readAppointments()
    appointmentsRef.current = savedAppointments
    setAppointments(savedAppointments)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
    } catch (error) {
      console.error('Unable to save MediBook appointments to localStorage.', error)
    }
  }, [appointments, isLoaded])

  const addAppointment = useCallback((appointment) => {
    const isDuplicate = appointmentsRef.current.some((saved) =>
      saved.status === 'Confirmed' &&
      saved.doctorId === appointment.doctorId &&
      saved.appointmentDate === appointment.appointmentDate &&
      saved.timeSlot === appointment.timeSlot,
    )
    if (isDuplicate) return false

    const updatedAppointments = [appointment, ...appointmentsRef.current]
    saveAppointments(updatedAppointments)
    appointmentsRef.current = updatedAppointments
    setAppointments(updatedAppointments)
    return true
  }, [])

  const updateAppointmentStatus = useCallback((id, status) => {
    const updatedAppointments = appointmentsRef.current.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
    )
    saveAppointments(updatedAppointments)
    appointmentsRef.current = updatedAppointments
    setAppointments(updatedAppointments)
  }, [])

  const cancelAppointment = useCallback((id) => {
    const appointment = appointmentsRef.current.find((saved) => saved.id === id)
    if (!appointment || appointment.status !== 'Confirmed' || isAppointmentPast(appointment)) {
      return false
    }
    updateAppointmentStatus(id, 'Cancelled')
    return true
  }, [updateAppointmentStatus])

  return { appointments, isLoaded, addAppointment, cancelAppointment, updateAppointmentStatus }
}
