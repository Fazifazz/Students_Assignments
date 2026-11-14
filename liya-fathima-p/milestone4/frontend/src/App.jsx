import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/AppLayout.jsx'
import Home from './pages/Home.jsx'
import { Login, Register } from './pages/AuthPages.jsx'
import {
  UserDashboard,
  SubmitComplaint,
  MyComplaints,
  ComplaintDetails,
  Notifications,
  Profile,
} from './pages/UserPages.jsx'
import {
  AdminDashboard,
  AdminComplaints,
  AdminComplaintDetails,
  Departments,
  AdminUsers,
  AdminReports,
} from './pages/AdminPages.jsx'
import './styles.css'

function RoutedLayout({ role }) {
  return (
    <ProtectedRoute role={role}>
      <AppLayout role={role} />
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<RoutedLayout role="user" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="submit-complaint" element={<SubmitComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<RoutedLayout role="admin" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="complaints/:id" element={<AdminComplaintDetails />} />
            <Route path="departments" element={<Departments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
