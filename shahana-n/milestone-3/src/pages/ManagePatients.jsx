import { useMemo, useState } from 'react'

export default function ManagePatients({ patients, appointments, deactivatePatient }) {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const filtered = useMemo(() => patients.filter((patient) =>
    `${patient.name} ${patient.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [patients, query])

  return (
    <main className="dashboard-page container">
      <section className="dashboard-welcome"><div><p className="eyebrow">ADMIN · PATIENTS</p><h1>Manage patients.</h1><p>Passwords are never shown here. Deactivated accounts keep their booking history.</p></div></section>
      <div className="management-toolbar"><label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" aria-label="Search patients by name or email" /></label></div>
      {message && <p className="success-banner" role="status">{message}</p>}
      {filtered.length ? <div className="management-table-wrap"><table className="management-table"><thead><tr><th>Patient</th><th>Phone</th><th>Appointments</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((patient) => <tr key={patient.id}><td>{patient.name}<small className="table-subtext">{patient.email}</small></td><td>{patient.phone}</td><td>{appointments.filter((appointment) => appointment.patientId === patient.id || (!appointment.patientId && appointment.email?.toLowerCase() === patient.email.toLowerCase())).length}</td><td>{patient.isActive === false ? 'Inactive' : 'Active'}</td><td>{patient.isActive !== false && <button className="text-button cancel-link" type="button" onClick={() => { if (window.confirm(`Deactivate the demo account for ${patient.name}?`)) { try { deactivatePatient(patient.id); setMessage(`${patient.name}'s account was deactivated.`) } catch { setMessage('The account change could not be saved. Check browser storage and try again.') } } }}>Deactivate account</button>}</td></tr>)}</tbody></table></div> : <div className="empty-state"><h2>No patients found</h2><p>Registered demo accounts will appear here.</p></div>}
    </main>
  )
}
