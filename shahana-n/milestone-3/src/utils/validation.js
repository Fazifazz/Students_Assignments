export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function timeSlotToMinutes(timeSlot) {
  const match = /^(\d{1,2}):(\d{2})\s(AM|PM)$/.exec(timeSlot || '')
  if (!match) return null
  if (Number(match[1]) < 1 || Number(match[1]) > 12 || Number(match[2]) > 59) return null
  let hours = Number(match[1]) % 12
  if (match[3] === 'PM') hours += 12
  return hours * 60 + Number(match[2])
}

export function isTimeSlotInPast(date, timeSlot, now = new Date()) {
  if (date !== getLocalDateString(now)) return false
  const slotMinutes = timeSlotToMinutes(timeSlot)
  return slotMinutes === null || slotMinutes <= now.getHours() * 60 + now.getMinutes()
}

export function isAppointmentPast(appointment, now = new Date()) {
  if (!isValidDateString(appointment.appointmentDate)) return false
  const today = getLocalDateString(now)
  if (appointment.appointmentDate < today) return true
  if (appointment.appointmentDate > today) return false
  const slotMinutes = timeSlotToMinutes(appointment.timeSlot)
  return slotMinutes !== null && slotMinutes <= now.getHours() * 60 + now.getMinutes()
}

export function getAppointmentDisplayStatus(appointment, now = new Date()) {
  if (appointment.status === 'Cancelled') return 'Cancelled'
  if (appointment.status === 'Confirmed' && isAppointmentPast(appointment, now)) return 'Completed'
  return appointment.status
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)
  return parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
}

export function validateAppointment(values, appointments, selectedDoctor, now = new Date()) {
  const errors = {}
  const today = getLocalDateString(now)

  if (!values.patientName.trim()) errors.patientName = 'Please enter your full name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (!/^\+?[\d\s().-]{7,20}$/.test(values.phone.trim()) ||
    values.phone.replace(/\D/g, '').length < 7 ||
    values.phone.replace(/\D/g, '').length > 15) {
    errors.phone = 'Enter a valid phone number (7–15 digits).'
  }
  if (!values.doctorId || !selectedDoctor) errors.doctorId = 'Please select a doctor.'
  if (!values.appointmentDate) errors.appointmentDate = 'Please choose an appointment date.'
  else if (!isValidDateString(values.appointmentDate)) {
    errors.appointmentDate = 'Enter a valid appointment date.'
  } else if (values.appointmentDate < today) {
    errors.appointmentDate = 'Past dates are not available.'
  } else if (selectedDoctor &&
    !selectedDoctor.availableDays.includes(
      new Date(`${values.appointmentDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }),
    )) {
    errors.appointmentDate = `This doctor is available on ${selectedDoctor.availableDays.join(', ')}.`
  }
  if (!values.timeSlot) errors.timeSlot = 'Please choose an available time.'
  else if (selectedDoctor && !selectedDoctor.timeSlots.includes(values.timeSlot)) {
    errors.timeSlot = 'Choose a time offered by this doctor.'
  } else if (values.appointmentDate && isTimeSlotInPast(values.appointmentDate, values.timeSlot, now)) {
    errors.timeSlot = 'That time has already passed. Choose a later slot.'
  }

  const duplicate = appointments.some((appointment) =>
    appointment.status === 'Confirmed' &&
    appointment.doctorId === values.doctorId &&
    appointment.appointmentDate === values.appointmentDate &&
    appointment.timeSlot === values.timeSlot,
  )
  if (!errors.doctorId && !errors.appointmentDate && !errors.timeSlot && duplicate) {
    errors.timeSlot = 'That slot has already been booked. Please choose another time.'
  }
  return errors
}
