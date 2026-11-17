import { useState } from 'react'

export default function DoctorProfile({ doctor, updateDoctor }) {
  const [values, setValues] = useState({
    name: doctor.name,
    specialization: doctor.specialization,
    qualifications: doctor.qualifications,
    experience: String(doctor.experience),
    fee: String(doctor.fee),
    bio: doctor.bio,
    image: doctor.image,
  })
  const [message, setMessage] = useState('')

  function submit(event) {
    event.preventDefault()
    if (!values.name.trim() || !values.specialization.trim() || !values.qualifications.trim() ||
      !Number.isFinite(Number(values.experience)) || Number(values.experience) < 0 ||
      !Number.isFinite(Number(values.fee)) || Number(values.fee) < 0 || !values.bio.trim()) {
      setMessage('Complete all required fields with valid numbers.')
      return
    }
    updateDoctor(doctor.id, {
      name: values.name.trim(),
      specialization: values.specialization.trim(),
      qualifications: values.qualifications.trim(),
      experience: Number(values.experience),
      fee: Number(values.fee),
      bio: values.bio.trim(),
      image: values.image.trim() || doctor.image,
    })
    setMessage('Your profile has been saved.')
  }

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">DOCTOR PROFILE</p><h1>Manage your profile.</h1><p>These details appear on your patient-facing profile.</p></div></section>
      <form className="management-form" onSubmit={submit}>
        <div className="auth-form-grid">
          {[
            ['name', 'Full name', 'text'], ['specialization', 'Specialization', 'text'],
            ['qualifications', 'Qualifications', 'text'], ['experience', 'Years of experience', 'number'],
            ['fee', 'Consultation fee ($)', 'number'], ['image', 'Profile image URL', 'url'],
          ].map(([key, label, type]) => <label className="form-field" key={key}><span>{label}</span><input type={type} min={type === 'number' ? 0 : undefined} value={values[key]} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
          <label className="form-field form-full-width"><span>Biography</span><textarea rows="4" value={values.bio} onChange={(event) => setValues((current) => ({ ...current, bio: event.target.value }))} /></label>
        </div>
        {message && <p className="success-banner" role="status">{message}</p>}
        <button className="button" type="submit">Save profile</button>
      </form>
    </main>
  )
}
