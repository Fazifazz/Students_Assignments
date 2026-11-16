import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound.jsx'

export default function DoctorDetails({ doctors }) {
  const { doctorId } = useParams()
  const doctor = doctors.find((item) => item.id === doctorId)
  if (!doctor || doctor.isActive === false) return <NotFound />

  return (
    <main className="container detail-page">
      <Link className="text-link detail-back" to="/doctors">← All doctors</Link>
      <section className="doctor-profile">
        <div className="profile-image"><img src={doctor.image} alt={doctor.name} /></div>
        <div className="profile-copy">
          <p className="eyebrow">{doctor.specialization}</p><h1>{doctor.name}</h1>
          <p className="profile-credentials">{doctor.qualifications} <span>·</span> {doctor.experience} years of experience</p>
          <p className="profile-bio">{doctor.bio}</p>
          <div className="profile-facts"><div><span>Consultation fee</span><strong>${doctor.fee}</strong></div><div><span>Available days</span><strong>{doctor.availableDays.join(', ')}</strong></div></div>
          <Link className="button" to={`/book?doctor=${doctor.id}`}>Book an appointment <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="availability-card">
        <div><p className="eyebrow">PLAN AHEAD</p><h2>Appointment availability</h2><p>Pick an available day and choose a time when you book.</p></div>
        <div className="availability-days">{doctor.availableDays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="availability-time"><strong>Available time slots</strong><div className="availability-days">{doctor.timeSlots.map((slot) => <span key={slot}>{slot}</span>)}</div></div>
        <p className="availability-footnote">Available times may change as appointments are booked. All times use your local time zone.</p>
      </section>
    </main>
  )
}
