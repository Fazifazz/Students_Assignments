import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { doctors as seedDoctors } from '../data/doctors.js'
import { getAppointmentDisplayStatus } from '../utils/validation.js'

function StatCard({ label, value, tone = '' }) {
  return <article className={`dashboard-stat ${tone}`}><span>{label}</span><strong>{value}</strong></article>
}

export default function PatientDashboard({ user, appointments, doctors }) {
  const ownAppointments = useMemo(() => appointments.filter((appointment) =>
    appointment.patientId === user.id ||
    (!appointment.patientId && appointment.email?.toLowerCase() === user.email.toLowerCase()),
  ), [appointments, user])
  const counts = useMemo(() => ({
    total: ownAppointments.length,
    upcoming: ownAppointments.filter((item) => getAppointmentDisplayStatus(item) === 'Confirmed').length,
    completed: ownAppointments.filter((item) => getAppointmentDisplayStatus(item) === 'Completed').length,
    cancelled: ownAppointments.filter((item) => item.status === 'Cancelled').length,
  }), [ownAppointments])
  const recent = [...ownAppointments].sort((a, b) =>
    `${b.appointmentDate} ${b.timeSlot}`.localeCompare(`${a.appointmentDate} ${a.timeSlot}`),
  ).slice(0, 3)

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">PATIENT DASHBOARD</p><h1>Welcome, {user.name.split(' ')[0]}.</h1><p>Your care details and next steps, all in one place.</p></div><Link className="button" to="/doctors">Find a doctor <span aria-hidden="true">→</span></Link></section>
      <div className="dashboard-stats">
        <StatCard label="Total appointments" value={counts.total} />
        <StatCard label="Upcoming" value={counts.upcoming} tone="stat-teal" />
        <StatCard label="Completed" value={counts.completed} />
        <StatCard label="Cancelled" value={counts.cancelled} />
      </div>
      <section className="dashboard-section">
        <div className="section-heading"><div><p className="eyebrow">YOUR LATEST ACTIVITY</p><h2>Recent appointments</h2></div><Link className="text-link" to="/appointments">Manage appointments →</Link></div>
        {recent.length ? <div className="appointment-list">{recent.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} doctor={doctors.find((doctor) => doctor.id === appointment.doctorId) || seedDoctors.find((doctor) => doctor.id === appointment.doctorId)} now={new Date()} />)}</div> : <div className="empty-state compact-empty"><span className="empty-icon" aria-hidden="true">♡</span><h2>No visits booked yet</h2><p>Browse doctors to find a time that works for you.</p><Link className="button" to="/doctors">Browse doctors</Link></div>}
      </section>
      <p className="auth-disclaimer">This patient dashboard is a local frontend demo. Do not enter real health information.</p>
    </main>
  )
}
