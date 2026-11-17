import { useMemo, useState } from 'react'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { getAppointmentDisplayStatus, isAppointmentPast } from '../utils/validation.js'

export default function DoctorAppointments({ doctor, appointments, updateAppointmentStatus }) {
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState('')
  const ownAppointments = useMemo(() => appointments
    .filter((appointment) => appointment.doctorId === doctor.id)
    .filter((appointment) => filter === 'all' || getAppointmentDisplayStatus(appointment) === filter)
    .sort((a, b) => `${a.appointmentDate} ${a.timeSlot}`.localeCompare(`${b.appointmentDate} ${b.timeSlot}`)),
  [appointments, doctor.id, filter])

  function complete(appointment) {
    if (!isAppointmentPast(appointment)) {
      setMessage('An appointment can be completed after its scheduled time.')
      return
    }
    updateAppointmentStatus(appointment.id, 'Completed')
    setMessage('Appointment marked completed.')
  }

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">DOCTOR WORKSPACE</p><h1>Your appointments.</h1><p>Only appointments assigned to {doctor.name} are shown.</p></div></section>
      <div className="management-toolbar"><label className="filter-select"><span>Filter appointments</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></label></div>
      {message && <p className="success-banner" role="status">{message}</p>}
      {ownAppointments.length ? <div className="appointment-list">{ownAppointments.map((appointment) => <div className="management-appointment" key={appointment.id}><AppointmentCard appointment={appointment} doctor={doctor} now={new Date()} />{appointment.status === 'Confirmed' && isAppointmentPast(appointment) && <button className="button button-outline" type="button" onClick={() => complete(appointment)}>Mark completed</button>}</div>)}</div> : <div className="empty-state"><h2>No appointments in this view</h2><p>New patient bookings assigned to you will appear here.</p></div>}
    </main>
  )
}
