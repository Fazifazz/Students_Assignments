import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { timeSlotToMinutes } from '../utils/validation.js'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const emptyDoctor = {
  name: '', email: '', specialization: '', qualifications: '', experience: '',
  fee: '', bio: '', image: '', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timeSlots: ['09:00 AM', '10:00 AM', '01:00 PM'],
}

function doctorToForm(doctor) {
  return { ...doctor, experience: String(doctor.experience), fee: String(doctor.fee) }
}

export default function ManageDoctors({ doctors, appointments, addDoctor, updateDoctor, deactivateDoctor }) {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))]
  const filtered = useMemo(() => doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(query.trim().toLowerCase()) &&
    (!specialty || doctor.specialization === specialty),
  ), [doctors, query, specialty])

  function startEdit(doctor) {
    setEditingId(doctor.id)
    setForm(doctorToForm(doctor))
    setMessage('')
  }

  function startAdd() {
    setEditingId(null)
    setForm({ ...emptyDoctor, availableDays: [...emptyDoctor.availableDays], timeSlots: [...emptyDoctor.timeSlots] })
    setMessage('')
  }

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.specialization.trim() ||
      !form.qualifications.trim() || !form.bio.trim() ||
      !Number.isFinite(Number(form.experience)) || Number(form.experience) < 0 ||
      !Number.isFinite(Number(form.fee)) || Number(form.fee) < 0 ||
      !form.availableDays.length || !form.timeSlots.length ||
      form.timeSlots.some((slot) => timeSlotToMinutes(slot) === null) ||
      new Set(form.timeSlots).size !== form.timeSlots.length) {
      setMessage('Complete the required fields and provide at least one day and time slot.')
      return
    }
    const emailTaken = doctors.some((doctor) =>
      doctor.email?.toLowerCase() === form.email.trim().toLowerCase() && doctor.id !== editingId,
    )
    if (emailTaken) {
      setMessage('That email is already used by another doctor.')
      return
    }
    const savedDoctor = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      experience: Number(form.experience),
      fee: Number(form.fee),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=640&q=85',
    }
    if (editingId) {
      updateDoctor(editingId, savedDoctor)
      setMessage('Doctor profile updated.')
    } else {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      if (!addDoctor({ ...savedDoctor, id })) {
        setMessage('A doctor with this name or email already exists.')
        return
      }
      setMessage('Doctor added to the directory.')
    }
    setForm(null)
  }

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">ADMIN · DOCTORS</p><h1>Manage doctors.</h1><p>Deactivation preserves appointment history and blocks future bookings.</p></div><button type="button" className="button" onClick={startAdd}>Add doctor <span aria-hidden="true">+</span></button></section>
      <div className="management-toolbar">
        <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors" aria-label="Search doctors" /></label>
        <label className="filter-select"><span>Specialization</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option value="">All specialties</option>{specializations.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      {message && <p className="success-banner" role="status">{message}</p>}
      {form && (
        <form className="management-form" onSubmit={submit}>
          <div className="section-heading"><h2>{editingId ? 'Edit doctor' : 'Add a doctor'}</h2><button type="button" className="text-button" onClick={() => setForm(null)}>Close</button></div>
          <div className="auth-form-grid">
            {[
              ['name', 'Full name'], ['email', 'Email address'], ['specialization', 'Specialization'],
              ['qualifications', 'Qualifications'], ['experience', 'Years of experience', 'number'],
              ['fee', 'Consultation fee ($)', 'number'], ['image', 'Profile image URL', 'url'],
            ].map(([key, label, type = 'text']) => <label className="form-field" key={key}><span>{label}</span><input type={type} min={type === 'number' ? 0 : undefined} required={key !== 'image'} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
            <label className="form-field form-full-width"><span>Biography</span><textarea rows="3" required value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} /></label>
            <fieldset className="form-field form-full-width"><legend>Available days</legend><div className="day-check-list">{weekDays.map((day) => <label key={day}><input type="checkbox" checked={form.availableDays.includes(day)} onChange={() => setForm((current) => ({ ...current, availableDays: current.availableDays.includes(day) ? current.availableDays.filter((item) => item !== day) : [...current.availableDays, day] }))} />{day}</label>)}</div></fieldset>
            <label className="form-field form-full-width"><span>Time slots (comma separated)</span><input value={form.timeSlots.join(', ')} onChange={(event) => setForm((current) => ({ ...current, timeSlots: event.target.value.split(',').map((slot) => slot.trim()).filter(Boolean) }))} /></label>
          </div>
          <button className="button" type="submit">{editingId ? 'Save changes' : 'Add doctor'}</button>
        </form>
      )}
      {filtered.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Doctor</th><th>Specialty</th><th>Experience</th><th>Fee</th><th>Bookings</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map((doctor) => <tr key={doctor.id}><td><div className="table-person"><img src={doctor.image} alt="" /><span>{doctor.name}<small>{doctor.email}</small></span></div></td><td>{doctor.specialization}</td><td>{doctor.experience} years</td><td>${doctor.fee}</td><td>{appointments.filter((appointment) => appointment.doctorId === doctor.id).length}</td><td>{doctor.isActive === false ? 'Inactive' : 'Active'}</td><td className="table-actions"><Link to={`/doctors/${doctor.id}`}>View</Link><button className="text-button" type="button" onClick={() => startEdit(doctor)}>Edit</button>{doctor.isActive !== false && <button className="text-button cancel-link" type="button" onClick={() => { if (window.confirm(`Deactivate ${doctor.name}? Existing appointments will be kept.`)) deactivateDoctor(doctor.id) }}>Deactivate</button>}</td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>No doctors found</h2><p>Try another search or filter.</p></div>}
    </main>
  )
}
