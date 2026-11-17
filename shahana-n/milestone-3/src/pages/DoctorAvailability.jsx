import { useMemo, useState } from 'react'
import { isAppointmentPast, timeSlotToMinutes } from '../utils/validation.js'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function DoctorAvailability({ doctor, appointments, updateDoctor }) {
  const [selectedDays, setSelectedDays] = useState(doctor.availableDays)
  const [slots, setSlots] = useState(doctor.timeSlots)
  const [newSlot, setNewSlot] = useState('')
  const [message, setMessage] = useState('')
  const bookedSlots = useMemo(() => appointments.filter((appointment) =>
    appointment.doctorId === doctor.id && appointment.status === 'Confirmed',
  ), [appointments, doctor.id])

  function toggleDay(day) {
    if (selectedDays.includes(day)) {
      const scheduledAppointments = bookedSlots.filter((appointment) => {
        if (isAppointmentPast(appointment)) return false
        return new Date(`${appointment.appointmentDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }) === day
      })
      if (scheduledAppointments.length && !window.confirm(
        `${scheduledAppointments.length} confirmed appointment(s) are scheduled on ${day}. Removing the day will not cancel them. Continue?`,
      )) return
    }
    setSelectedDays((current) => current.includes(day)
      ? current.filter((item) => item !== day)
      : [...current, day])
  }

  function addSlot(event) {
    event.preventDefault()
    if (timeSlotToMinutes(newSlot) === null || slots.includes(newSlot)) {
      setMessage('Enter a unique time in the format 09:00 AM.')
      return
    }
    setSlots((current) => [...current, newSlot].sort((a, b) => timeSlotToMinutes(a) - timeSlotToMinutes(b)))
    setNewSlot('')
    setMessage('')
  }

  function removeSlot(slot) {
    const activeBooking = bookedSlots.some((appointment) =>
      appointment.timeSlot === slot && !isAppointmentPast(appointment),
    )
    if (activeBooking && !window.confirm(`There is a confirmed appointment at ${slot}. Remove this slot from future availability? The existing appointment will stay booked.`)) return
    setSlots((current) => current.filter((item) => item !== slot))
  }

  function save() {
    if (!selectedDays.length || !slots.length) {
      setMessage('Keep at least one available day and one time slot.')
      return
    }
    updateDoctor(doctor.id, { availableDays: selectedDays, timeSlots: slots })
    setMessage('Availability saved. New bookings will use this schedule.')
  }

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">DOCTOR SCHEDULE</p><h1>Manage availability.</h1><p>Existing appointments remain unchanged if you edit your schedule.</p></div></section>
      <section className="management-form">
        <h2>Available days</h2>
        <div className="availability-days">{weekdays.map((day) => <label className="day-choice" key={day}><input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} />{day}</label>)}</div>
        <h2 className="form-subheading">Appointment time slots</h2>
        <div className="slot-chip-list">{slots.map((slot) => <span className="slot-chip" key={slot}>{slot}<button type="button" aria-label={`Remove ${slot}`} onClick={() => removeSlot(slot)}>×</button></span>)}</div>
        <form className="add-slot-form" onSubmit={addSlot}><label className="form-field"><span>New time slot</span><input placeholder="09:00 AM" value={newSlot} onChange={(event) => setNewSlot(event.target.value.toUpperCase())} /></label><button className="button button-outline" type="submit">Add time</button></form>
        {message && <p className={message.includes('saved') ? 'success-banner' : 'form-submit-error'} role="status">{message}</p>}
        <button className="button" type="button" onClick={save}>Save availability</button>
      </section>
    </main>
  )
}
