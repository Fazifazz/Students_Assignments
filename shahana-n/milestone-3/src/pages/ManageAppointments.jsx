import { useMemo, useState } from 'react'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { getAppointmentDisplayStatus, isAppointmentPast } from '../utils/validation.js'

export default function ManageAppointments({ appointments, doctors, updateAppointmentStatus }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [message, setMessage] = useState('')
  const filtered = useMemo(() => appointments
    .filter((appointment) => {
      const doctor = doctors.find((item) => item.id === appointment.doctorId)
      const text = `${appointment.patientName || ''} ${appointment.email || ''} ${doctor?.name || ''}`.toLowerCase()
      return text.includes(query.trim().toLowerCase()) &&
        (!dateFilter || appointment.appointmentDate === dateFilter) &&
        (status === 'all' || getAppointmentDisplayStatus(appointment) === status)
    })
    .sort((a, b) => `${a.appointmentDate} ${a.timeSlot}`.localeCompare(`${b.appointmentDate} ${b.timeSlot}`)),
  [appointments, doctors, query, status, dateFilter])

  function cancel(appointment) {
    if (!window.confirm(`Cancel ${appointment.patientName}'s appointment on ${appointment.appointmentDate} at ${appointment.timeSlot}?`)) return
    try {
      updateAppointmentStatus(appointment.id, 'Cancelled')
      setMessage('Appointment cancelled and slot released.')
    } catch {
      setMessage('Could not save the cancellation. Check browser storage and try again.')
    }
  }

  function complete(appointment) {
    if (!isAppointmentPast(appointment)) {
      setMessage('Only appointments whose scheduled time has passed can be completed.')
      return
    }
    updateAppointmentStatus(appointment.id, 'Completed')
    setMessage('Appointment marked completed.')
  }

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">ADMIN · APPOINTMENTS</p><h1>Booking history.</h1><p>Review appointments across the demo application.</p></div></section>
      <div className="management-toolbar admin-filter-toolbar">
        <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient or doctor" aria-label="Search patient or doctor" /></label>
        <label className="filter-select"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></label>
        <label className="filter-select"><span>Date</span><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
      </div>
      {message && <p className="success-banner" role="status">{message}</p>}
      {filtered.length ? <div className="appointment-list">{filtered.map((appointment) => <div className="management-appointment" key={appointment.id}><AppointmentCard appointment={appointment} doctor={doctors.find((doctor) => doctor.id === appointment.doctorId)} now={new Date()} /><div className="management-row-actions">{appointment.status !== 'Cancelled' && getAppointmentDisplayStatus(appointment) !== 'Completed' && <button className="text-button cancel-link" type="button" onClick={() => cancel(appointment)}>Cancel booking</button>}{appointment.status === 'Confirmed' && getAppointmentDisplayStatus(appointment) === 'Completed' && <button className="text-button" type="button" onClick={() => complete(appointment)}>Save completed status</button>}</div></div>)}</div> : <div className="empty-state"><h2>No appointments match</h2><p>Try another name, status, or date.</p></div>}
    </main>
  )
}
