import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocalDateString, isTimeSlotInPast, validateAppointment } from '../utils/validation.js'

const initialValues = (doctorId = '') => ({
  patientName: '',
  email: '',
  phone: '',
  doctorId,
  appointmentDate: '',
  timeSlot: '',
  reason: '',
})

function FieldError({ children }) {
  return children ? <span className="field-error" role="alert">{children}</span> : null
}

export default function AppointmentForm({
  doctors,
  appointments,
  initialDoctorId = '',
  isLoaded,
  addAppointment,
  user,
}) {
  const [values, setValues] = useState(() => ({
    ...initialValues(initialDoctorId),
    patientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const selectedDoctor = doctors.find((doctor) => doctor.id === values.doctorId)

  const availableSlots = useMemo(() => {
    if (!selectedDoctor) return []
    return selectedDoctor.timeSlots.filter(
      (slot) => !values.appointmentDate || !isTimeSlotInPast(values.appointmentDate, slot),
    )
  }, [selectedDoctor, values.appointmentDate])

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === 'doctorId' || name === 'appointmentDate' ? { timeSlot: '' } : {}),
    }))
    setErrors((current) => ({ ...current, [name]: '', ...(name === 'doctorId' || name === 'appointmentDate' ? { timeSlot: '' } : {}) }))
    setFormError('')
    setConfirmation(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (submitting || !isLoaded) return
    const doctor = doctors.find((item) => item.id === values.doctorId)
    const nextErrors = validateAppointment(values, appointments, doctor)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const appointment = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      patientName: values.patientName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      patientId: user?.id,
      doctorId: doctor.id,
      appointmentDate: values.appointmentDate,
      timeSlot: values.timeSlot,
      reason: values.reason.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }

    let added
    try {
      added = addAppointment(appointment)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Your appointment could not be saved. Please try again.')
      setSubmitting(false)
      return
    }
    if (!added) {
      setErrors({ timeSlot: 'That slot was just booked. Please choose another time.' })
      setSubmitting(false)
      return
    }
    setConfirmation({ appointment, doctor })
    setValues({
      ...initialValues(initialDoctorId),
      patientName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setSubmitting(false)
  }

  if (confirmation) {
    const { appointment, doctor } = confirmation
    return (
      <section className="confirmation-panel" aria-live="polite">
        <div className="confirmation-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">Appointment confirmed</p>
        <h2>You’re all set, {appointment.patientName.split(' ')[0]}.</h2>
        <p>Your appointment has been saved in this browser.</p>
        <div className="confirmation-details">
          <div><span>Doctor</span><strong>{doctor.name}</strong><small>{doctor.specialization}</small></div>
          <div><span>Date &amp; time</span><strong>{new Date(`${appointment.appointmentDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong><small>{appointment.timeSlot}</small></div>
        </div>
        <div className="confirmation-note">This is a frontend demo. No doctor has been contacted and no email or payment has been sent.</div>
        <Link className="button" to="/appointments">View my appointments <span aria-hidden="true">→</span></Link>
      </section>
    )
  }

  if (!isLoaded) return <div className="loading-panel" role="status">Loading saved appointment information…</div>

  return (
    <form className="appointment-form" onSubmit={handleSubmit} noValidate>
      <div className="form-section-heading">
        <span className="step-number">01</span>
        <div><h2>Your details</h2><p>Tell us how to identify this appointment.</p></div>
      </div>
      <div className="form-grid">
        <label className="form-field">
          <span>Full name <b>*</b></span>
          <input name="patientName" autoComplete="name" value={values.patientName} onChange={updateField} placeholder="e.g. Alex Morgan" aria-invalid={Boolean(errors.patientName)} />
          <FieldError>{errors.patientName}</FieldError>
        </label>
        <label className="form-field">
          <span>Email address <b>*</b></span>
          <input type="email" name="email" autoComplete="email" value={values.email} onChange={updateField} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
          <FieldError>{errors.email}</FieldError>
        </label>
        <label className="form-field">
          <span>Phone number <b>*</b></span>
          <input type="tel" name="phone" autoComplete="tel" value={values.phone} onChange={updateField} placeholder="+1 (555) 000-0000" aria-invalid={Boolean(errors.phone)} />
          <FieldError>{errors.phone}</FieldError>
        </label>
        <label className="form-field">
          <span>Doctor <b>*</b></span>
          <select name="doctorId" value={values.doctorId} onChange={updateField} aria-invalid={Boolean(errors.doctorId)}>
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} — {doctor.specialization}</option>)}
          </select>
          <FieldError>{errors.doctorId}</FieldError>
        </label>
      </div>

      <div className="form-section-heading form-section-spacing">
        <span className="step-number">02</span>
        <div><h2>Choose a time</h2><p>Pick a day and an available appointment slot.</p></div>
      </div>
      <div className="form-grid">
        <label className="form-field">
          <span>Appointment date <b>*</b></span>
          <input type="date" name="appointmentDate" min={getLocalDateString()} value={values.appointmentDate} onChange={updateField} aria-invalid={Boolean(errors.appointmentDate)} />
          <FieldError>{errors.appointmentDate}</FieldError>
        </label>
        <label className="form-field">
          <span>Available time <b>*</b></span>
          <select name="timeSlot" value={values.timeSlot} onChange={updateField} disabled={!selectedDoctor || !values.appointmentDate} aria-invalid={Boolean(errors.timeSlot)}>
            <option value="">{!selectedDoctor ? 'Select a doctor first' : !values.appointmentDate ? 'Select a date first' : availableSlots.length ? 'Choose a time' : 'No times left today'}</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot} disabled={appointments.some((appointment) =>
                appointment.status === 'Confirmed' &&
                appointment.doctorId === selectedDoctor.id &&
                appointment.appointmentDate === values.appointmentDate &&
                appointment.timeSlot === slot,
              )}>
                {slot}{appointments.some((appointment) =>
                  appointment.status === 'Confirmed' &&
                  appointment.doctorId === selectedDoctor.id &&
                  appointment.appointmentDate === values.appointmentDate &&
                  appointment.timeSlot === slot,
                ) ? ' — booked' : ''}
              </option>
            ))}
          </select>
          <FieldError>{errors.timeSlot}</FieldError>
        </label>
      </div>
      {selectedDoctor && <p className="availability-hint">Available {selectedDoctor.availableDays.join(', ')} · All times shown in your local time zone.</p>}
      <label className="form-field reason-field">
        <span>Reason for visit <small>Optional</small></span>
        <textarea name="reason" rows="3" value={values.reason} onChange={updateField} placeholder="Briefly tell the doctor what you’d like help with." />
      </label>
      <p className="privacy-note">Your details stay in this browser for this demo and are not sent to a doctor.</p>
      {formError && <p className="form-submit-error" role="alert">{formError}</p>}
      <button className="button submit-button" type="submit" disabled={submitting || !isLoaded}>
        {submitting ? 'Confirming…' : 'Confirm appointment'} <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
