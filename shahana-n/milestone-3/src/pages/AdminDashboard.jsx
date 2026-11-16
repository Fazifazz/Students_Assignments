import { Link } from 'react-router-dom'
import { getAppointmentDisplayStatus } from '../utils/validation.js'

export default function AdminDashboard({ patients, doctors, appointments }) {
  const statuses = appointments.map((appointment) => getAppointmentDisplayStatus(appointment))
  const cards = [
    ['Registered patients', patients.filter((patient) => patient.isActive !== false).length],
    ['Active doctors', doctors.filter((doctor) => doctor.isActive !== false).length],
    ['Total appointments', appointments.length],
    ['Upcoming appointments', statuses.filter((status) => status === 'Confirmed').length],
    ['Completed appointments', statuses.filter((status) => status === 'Completed').length],
    ['Cancelled appointments', statuses.filter((status) => status === 'Cancelled').length],
  ]

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">ADMIN WORKSPACE</p><h1>Overview.</h1><p>Manage demo accounts, doctor listings, and appointment history.</p></div></section>
      <div className="dashboard-stats admin-stats">{cards.map(([label, value]) => <article className="dashboard-stat" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
      <div className="management-links">
        <Link to="/admin/doctors"><strong>Manage doctors</strong><span>Add, update, and deactivate listings →</span></Link>
        <Link to="/admin/patients"><strong>Manage patients</strong><span>Search and review demo accounts →</span></Link>
        <Link to="/admin/appointments"><strong>Manage appointments</strong><span>Review and cancel bookings →</span></Link>
      </div>
      <div className="demo-credential-note"><strong>Security note:</strong> roles and data are stored in browser localStorage for demonstration only. Server-side authentication and authorization are required for real use.</div>
    </main>
  )
}
