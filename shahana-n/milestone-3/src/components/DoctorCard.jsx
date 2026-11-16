import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card">
      <Link className="doctor-photo-link" to={`/doctors/${doctor.id}`} aria-label={`View ${doctor.name}'s profile`}>
        <img className="doctor-photo" src={doctor.image} alt={doctor.name} loading="lazy" />
        <span className="availability-pill"><span /> Accepting patients</span>
      </Link>
      <div className="doctor-card-body">
        <p className="eyebrow">{doctor.specialization}</p>
        <h3>{doctor.name}</h3>
        <p className="doctor-credentials">{doctor.qualifications} <span>·</span> {doctor.experience} years experience</p>
        <div className="doctor-card-meta">
          <span>Consultation</span><strong>${doctor.fee}</strong>
        </div>
        <div className="card-actions">
          <Link className="button button-outline" to={`/doctors/${doctor.id}`}>View profile</Link>
          <Link className="button" to={`/book?doctor=${doctor.id}`}>Book visit</Link>
        </div>
      </div>
    </article>
  )
}
