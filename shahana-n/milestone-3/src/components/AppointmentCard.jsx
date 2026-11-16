import { Link } from 'react-router-dom'
import { getAppointmentDisplayStatus } from '../utils/validation.js'

export default function AppointmentCard({ appointment, doctor, onCancel, now }) {
  const displayStatus = getAppointmentDisplayStatus(appointment, now)
  const date = new Date(`${appointment.appointmentDate}T00:00:00`)
  const validDate = !Number.isNaN(date.getTime())

  return (
    <article className="appointment-card">
      {doctor ? (
        <img className="appointment-doctor-image" src={doctor.image} alt={doctor.name} loading="lazy" />
      ) : (
        <div className="appointment-doctor-placeholder" aria-hidden="true">+</div>
      )}
      <div className="appointment-date-tile">
        <span>{validDate ? date.toLocaleDateString('en-US', { month: 'short' }) : 'Date'}</span>
        <strong>{validDate ? date.getDate() : '—'}</strong>
        <small>{validDate ? date.toLocaleDateString('en-US', { weekday: 'short' }) : 'unavailable'}</small>
      </div>
      <div className="appointment-main">
        <div className="appointment-heading">
          <div>
            <p className="eyebrow">{doctor?.specialization || 'Medical visit'} · {appointment.timeSlot}</p>
            <h3>{doctor?.name || 'Doctor unavailable'}</h3>
            <p>Patient: {appointment.patientName}</p>
          </div>
          <span className={`status-pill status-${displayStatus.toLowerCase()}`}>{displayStatus}</span>
        </div>
        {appointment.reason && <p className="appointment-reason"><strong>Reason for visit:</strong> {appointment.reason}</p>}
        <div className="appointment-actions">
          {doctor && <Link to={`/doctors/${doctor.id}`}>Doctor profile <span aria-hidden="true">↗</span></Link>}
          {displayStatus === 'Confirmed' && onCancel && (
            <button type="button" className="text-button cancel-link" onClick={() => onCancel(appointment.id)}>
              Cancel appointment
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
