import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { getAppointmentDisplayStatus } from '../utils/validation.js'

const appointmentTabs = [
  ['all', 'All appointments'],
  ['upcoming', 'Upcoming'],
  ['past', 'Past'],
  ['cancelled', 'Cancelled'],
]

function matchesCategory(appointment, category, now) {
  const status = getAppointmentDisplayStatus(appointment, now)
  if (category === 'all') return true
  if (category === 'cancelled') return status === 'Cancelled'
  if (category === 'upcoming') return status === 'Confirmed'
  return status === 'Completed'
}

function categoryEmptyMessage(category) {
  const messages = {
    all: ['No appointments yet', 'Appointments you book will appear here.'],
    upcoming: ['Nothing on your calendar yet', 'Find a doctor and book a time that works for you.'],
    past: ['No past visits', 'Completed appointments will appear here.'],
    cancelled: ['No cancelled appointments', 'Appointments you cancel will be kept here for reference.'],
  }
  return messages[category]
}

function appointmentTimestamp(appointment) {
  const date = new Date(`${appointment.appointmentDate}T00:00:00`)
  const time = appointment.timeSlot.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/)
  if (Number.isNaN(date.getTime()) || !time) return 0
  let hours = Number(time[1]) % 12
  if (time[3] === 'PM') hours += 12
  return date.getTime() + (hours * 60 + Number(time[2])) * 60_000
}

export default function MyAppointments({ appointments, isLoaded, cancelAppointment, user, doctors }) {
  const [view, setView] = useState('all')
  const [notice, setNotice] = useState('')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const ownAppointments = useMemo(() => appointments.filter((appointment) =>
    appointment.patientId === user.id ||
    (!appointment.patientId && appointment.email?.toLowerCase() === user.email.toLowerCase()),
  ), [appointments, user])

  const visibleAppointments = useMemo(() => {
    return ownAppointments
      .filter((appointment) => matchesCategory(appointment, view, now))
      .sort((a, b) => appointmentTimestamp(a) - appointmentTimestamp(b))
  }, [ownAppointments, view, now])

  const counts = useMemo(() => Object.fromEntries(
    appointmentTabs.map(([category]) => [
      category,
      ownAppointments.filter((appointment) => matchesCategory(appointment, category, now)).length,
    ]),
  ), [ownAppointments, now])

  function handleCancel(id) {
    const appointment = appointments.find((item) => item.id === id)
    if (!appointment) return
    const doctor = doctors.find((item) => item.id === appointment.doctorId)
    const doctorName = doctor?.name || 'this doctor'
    const confirmed = window.confirm(
      `Cancel the appointment with ${doctorName} on ${appointment.appointmentDate} at ${appointment.timeSlot}? This time slot will become available again.`,
    )
    if (!confirmed) return
    try {
      if (cancelAppointment(id)) {
        setNotice('Appointment cancelled. The time slot is available again.')
      } else {
        setNotice('This appointment can no longer be cancelled.')
      }
    } catch {
      setNotice('The cancellation could not be saved. Please check browser storage and try again.')
    }
  }

  if (!isLoaded) return <main className="container loading-page" role="status">Loading your appointments…</main>

  const [emptyTitle, emptyDescription] = categoryEmptyMessage(view)

  return (
    <main className="page-main">
      <section className="page-intro appointments-intro">
        <div className="container">
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1>My appointments.</h1>
          <p>Keep track of upcoming care, completed visits, and cancellations.</p>
        </div>
      </section>
      <section className="container appointments-content">
        <div className="appointment-toolbar">
          <div className="appointment-tabs" role="tablist" aria-label="Appointment category">
            {appointmentTabs.map(([category, label]) => (
              <button
                className={view === category ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={view === category}
                aria-controls="appointment-results"
                key={category}
                onClick={() => { setView(category); setNotice('') }}
              >
                {label} <span className="tab-count">{counts[category]}</span>
              </button>
            ))}
          </div>
          <span>{ownAppointments.filter((appointment) => appointment.status === 'Confirmed').length} confirmed</span>
        </div>
        {notice && <p className="success-banner" role="status">{notice}</p>}
        <div id="appointment-results" role="tabpanel" aria-live="polite" aria-label={`${view} appointments`}>
          {visibleAppointments.length ? (
            <div className="appointment-list">
              {visibleAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  doctor={doctors.find((doctor) => doctor.id === appointment.doctorId)}
                  onCancel={handleCancel}
                  now={now}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">♡</span>
              <h2>{emptyTitle}</h2>
              <p>{emptyDescription}</p>
              {(view === 'all' || view === 'upcoming') && (
                <Link className="button" to="/doctors">Find a doctor <span aria-hidden="true">→</span></Link>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
