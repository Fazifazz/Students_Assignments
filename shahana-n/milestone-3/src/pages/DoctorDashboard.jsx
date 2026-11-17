import { Link } from 'react-router-dom'
import { getAppointmentDisplayStatus, getLocalDateString } from '../utils/validation.js'

export default function DoctorDashboard({ user, doctor, appointments }) {
  const assigned = appointments.filter((appointment) => appointment.doctorId === doctor.id)
  const upcoming = assigned.filter((appointment) => getAppointmentDisplayStatus(appointment) === 'Confirmed')
  const completed = assigned.filter((appointment) => getAppointmentDisplayStatus(appointment) === 'Completed')
  const todays = upcoming.filter((appointment) => appointment.appointmentDate === getLocalDateString())

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">DOCTOR DASHBOARD</p><h1>Welcome, {doctor.name}.</h1><p>{doctor.specialization} · {doctor.qualifications}</p></div><img className="dashboard-avatar" src={doctor.image} alt={doctor.name} /></section>
      <div className="dashboard-stats">
        <article className="dashboard-stat stat-teal"><span>Today's appointments</span><strong>{todays.length}</strong></article>
        <article className="dashboard-stat"><span>Upcoming appointments</span><strong>{upcoming.length}</strong></article>
        <article className="dashboard-stat"><span>Completed appointments</span><strong>{completed.length}</strong></article>
        <article className="dashboard-stat"><span>Cancelled appointments</span><strong>{assigned.filter((appointment) => appointment.status === 'Cancelled').length}</strong></article>
      </div>
      <div className="management-links">
        <Link to="/doctor/appointments"><strong>Manage appointments</strong><span>Review your patient bookings →</span></Link>
        <Link to="/doctor/profile"><strong>Update your profile</strong><span>Edit professional details →</span></Link>
        <Link to="/doctor/availability"><strong>Manage availability</strong><span>Set days and time slots →</span></Link>
      </div>
      <div className="demo-credential-note"><strong>Demo account:</strong> {user.email}. Changes are saved only in this browser.</div>
    </main>
  )
}
