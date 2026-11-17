import { Link, useSearchParams } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm.jsx'

export default function BookAppointment({ appointments, isLoaded, addAppointment, doctors, user }) {
  const [searchParams] = useSearchParams()
  const initialDoctorId = searchParams.get('doctor') || ''
  const selectedDoctor = doctors.find((doctor) => doctor.id === initialDoctorId)

  return (
    <main className="page-main booking-page">
      <section className="page-intro booking-intro">
        <div className="container"><Link className="text-link intro-back" to={selectedDoctor ? `/doctors/${selectedDoctor.id}` : '/doctors'}>← {selectedDoctor ? 'Doctor profile' : 'Browse doctors'}</Link><p className="eyebrow">A MOMENT FOR YOURSELF</p><h1>Book an appointment.</h1><p>A few details now, a clearer next step for your health.</p></div>
      </section>
      <div className="container booking-layout">
        <div className="booking-form-column">
          <AppointmentForm doctors={doctors.filter((doctor) => doctor.isActive !== false)} appointments={appointments} initialDoctorId={initialDoctorId} isLoaded={isLoaded} addAppointment={addAppointment} user={user} />
        </div>
        <aside className="booking-sidebar">
          <div className="sidebar-card">
            <span className="sidebar-icon" aria-hidden="true">✳</span>
            <p className="eyebrow">GOOD TO KNOW</p>
            <h2>Your care, on your terms.</h2>
            <p>Choose a time that suits you. You can review or cancel confirmed appointments from My appointments.</p>
            <div className="sidebar-divider" />
            <ul><li>Appointments are saved in this browser</li><li>No payment is collected</li><li>No messages are sent to doctors</li></ul>
          </div>
          <p className="demo-disclaimer">MediBook is a fictional frontend demo and is not a medical provider.</p>
        </aside>
      </div>
    </main>
  )
}
