import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { useAppointments } from './hooks/useAppointments.js'
import { useDoctors } from './hooks/useDoctors.js'
import AdminDashboard from './pages/AdminDashboard.jsx'
import BookAppointment from './pages/BookAppointment.jsx'
import DoctorAppointments from './pages/DoctorAppointments.jsx'
import DoctorAvailability from './pages/DoctorAvailability.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import DoctorDetails from './pages/DoctorDetails.jsx'
import DoctorProfile from './pages/DoctorProfile.jsx'
import Doctors from './pages/Doctors.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import ManageAppointments from './pages/ManageAppointments.jsx'
import ManageDoctors from './pages/ManageDoctors.jsx'
import ManagePatients from './pages/ManagePatients.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import NotFound from './pages/NotFound.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import Register from './pages/Register.jsx'
import RoleRedirect from './pages/RoleRedirect.jsx'
import { isAppointmentPast } from './utils/validation.js'

export default function App() {
  const { appointments, isLoaded, addAppointment, cancelAppointment, updateAppointmentStatus } = useAppointments()
  const { doctors, updateDoctor, addDoctor, deactivateDoctor, storageError: doctorStorageError } = useDoctors()
  const { user, role, patients, deactivatePatient } = useAuth()
  const upcomingCount = user?.role === 'patient'
    ? appointments.filter((appointment) =>
      (appointment.patientId === user.id || (!appointment.patientId && appointment.email?.toLowerCase() === user.email.toLowerCase())) &&
      appointment.status === 'Confirmed' && !isAppointmentPast(appointment),
    ).length
    : 0
  const activeDoctor = role === 'doctor' ? doctors.find((doctor) => doctor.id === user?.id) : null

  return (
    <div className="app-shell">
      <Navbar appointmentCount={upcomingCount} />
      {user && <div className="session-strip"><span>Signed in as <strong>{user.name}</strong> · {role}</span></div>}
      {doctorStorageError && <div className="container storage-warning" role="alert">{doctorStorageError}</div>}
      <Routes>
        <Route path="/" element={<Home appointments={appointments} doctors={doctors} user={user} />} />
        <Route path="/doctors" element={<Doctors doctors={doctors} />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetails doctors={doctors} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        <Route element={<ProtectedRoute roles={['patient']} doctors={doctors} />}>
          <Route path="/patient" element={<PatientDashboard user={user} appointments={appointments} doctors={doctors} />} />
          <Route path="/book" element={<BookAppointment appointments={appointments} isLoaded={isLoaded} addAppointment={addAppointment} doctors={doctors} user={user} />} />
          <Route path="/appointments" element={<MyAppointments user={user} doctors={doctors} appointments={appointments} isLoaded={isLoaded} cancelAppointment={cancelAppointment} />} />
        </Route>

        <Route element={<ProtectedRoute roles={['doctor']} doctors={doctors} />}>
          <Route path="/doctor" element={activeDoctor ? <DoctorDashboard user={user} doctor={activeDoctor} appointments={appointments} /> : <Navigate to="/login" replace />} />
          <Route path="/doctor/profile" element={activeDoctor ? <DoctorProfile doctor={activeDoctor} updateDoctor={updateDoctor} /> : <Navigate to="/login" replace />} />
          <Route path="/doctor/availability" element={activeDoctor ? <DoctorAvailability doctor={activeDoctor} appointments={appointments} updateDoctor={updateDoctor} /> : <Navigate to="/login" replace />} />
          <Route path="/doctor/appointments" element={activeDoctor ? <DoctorAppointments doctor={activeDoctor} appointments={appointments} updateAppointmentStatus={updateAppointmentStatus} /> : <Navigate to="/login" replace />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} doctors={doctors} />}>
          <Route path="/admin" element={<AdminDashboard patients={patients} doctors={doctors} appointments={appointments} />} />
          <Route path="/admin/doctors" element={<ManageDoctors doctors={doctors} appointments={appointments} addDoctor={addDoctor} updateDoctor={updateDoctor} deactivateDoctor={deactivateDoctor} />} />
          <Route path="/admin/patients" element={<ManagePatients patients={patients} appointments={appointments} deactivatePatient={deactivatePatient} />} />
          <Route path="/admin/appointments" element={<ManageAppointments appointments={appointments} doctors={doctors} updateAppointmentStatus={updateAppointmentStatus} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
