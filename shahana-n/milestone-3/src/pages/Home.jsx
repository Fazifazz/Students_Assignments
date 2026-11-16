import { Link } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard.jsx'
import { isAppointmentPast } from '../utils/validation.js'

export default function Home({ appointments, doctors = [], user }) {
  const patientAppointments = user?.role === 'patient'
    ? appointments.filter((appointment) =>
      appointment.patientId === user.id ||
      (!appointment.patientId && appointment.email?.toLowerCase() === user.email.toLowerCase()),
    )
    : []
  const confirmedAppointments = patientAppointments.filter((appointment) => appointment.status === 'Confirmed')
  const upcomingCount = confirmedAppointments.filter((appointment) => !isAppointmentPast(appointment)).length
  const completedCount = confirmedAppointments.length - upcomingCount
  const specializations = [...new Set(doctors.filter((doctor) => doctor.isActive !== false).map((doctor) => doctor.specialization))]
  const appointmentPath = user?.role === 'patient'
    ? '/appointments'
    : user?.role === 'doctor'
      ? '/doctor/appointments'
      : user?.role === 'admin'
        ? '/admin/appointments'
        : '/login'

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> BETTER CARE STARTS HERE</div>
            <h1>Your health,<br /><em>our priority.</em></h1>
            <p>Find trusted doctors, book a time that works for you, and make your next step toward feeling better.</p>
            <div className="hero-actions">
              <Link className="button" to="/doctors">Find a doctor <span aria-hidden="true">→</span></Link>
              <Link className="text-link" to={appointmentPath}>{user ? 'Manage appointments' : 'Patient sign in'} <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>SM</span><span>JW</span><span>MP</span></div><p><strong>Care made simple</strong><br />A calmer way to book your visit</p></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=90" alt="Doctor smiling in a bright clinic" /></div>
            <div className="floating-card"><span className="floating-icon">✳</span><div><strong>Care, on your time</strong><small>Choose a slot that works for you</small></div></div>
            <div className="hero-scribble" aria-hidden="true">+</div>
          </div>
        </div>
      </section>
      {user?.role === 'patient' && <section className="appointment-stats" aria-label="Appointment summary">
        <div className="container appointment-stats-inner">
          <div className="stats-intro"><p className="eyebrow">YOUR CARE AT A GLANCE</p><h2>Your appointments</h2></div>
          <div className="stats-values">
            <div><strong>{confirmedAppointments.length}</strong><span>Confirmed</span></div>
            <div><strong>{upcomingCount}</strong><span>Upcoming</span></div>
            <div><strong>{completedCount}</strong><span>Completed</span></div>
          </div>
          <Link className="text-link stats-link" to={appointmentPath}>View appointments <span aria-hidden="true">→</span></Link>
        </div>
      </section>}
      <section className="specialty-strip section-pad">
        <div className="container specialty-layout">
          <div><p className="eyebrow">CARE FOR EVERY CHAPTER</p><h2>What can we help with?</h2></div>
          <div className="specialty-list">{specializations.map((specialty) => <Link key={specialty} to={`/doctors?specialty=${encodeURIComponent(specialty)}`}>{specialty}<span aria-hidden="true">↗</span></Link>)}</div>
        </div>
      </section>
      <section className="section-pad featured-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">A GOOD PLACE TO START</p><h2>Meet our doctors</h2></div><Link className="text-link" to="/doctors">View all doctors <span aria-hidden="true">→</span></Link></div>
          <div className="doctor-grid">{doctors.filter((doctor) => doctor.isActive !== false).slice(0, 3).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>
        </div>
      </section>
      <section className="how-section section-pad">
        <div className="container">
          <div className="center-heading"><p className="eyebrow">A FEW SIMPLE STEPS</p><h2>Care without the complicated.</h2></div>
          <div className="steps-grid">
            {[['01', 'Find your fit', 'Browse experienced doctors by specialty and choose the care that feels right.'], ['02', 'Pick your time', 'See available days and choose an appointment slot that works for you.'], ['03', 'Feel prepared', 'Review your booking anytime from your personal appointments page.']].map(([number, title, description]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>
    </>
  )
}
