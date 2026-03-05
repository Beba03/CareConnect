import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';

import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';

import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";
import DoctorPatientView from "./pages/DoctorPatientView";

import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import MedicalRecords from './pages/MedicalRecords';

import MedicalRecordDetails from './pages/MedicalRecordDetails';

import Appointments from './pages/Appointments';
import AppointmentDetails from './pages/AppointmentDetails';

import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"
        element={
          isAuthenticated ?
            (user?.role === 'Patient' ? <Navigate to="/patient/dashboard" replace /> : <Navigate to="/doctor/dashboard" replace />) : (<Login />)}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      {/* Patient routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute requireRole="Patient">
            <PatientDashboard />
          </ProtectedRoute>}
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute requireRole="Patient">
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute requireRole="Patient">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/records"
        element={
          <ProtectedRoute requireRole="Patient">
            <MedicalRecords />
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route path="/doctor/dashboard"
        element={
          <ProtectedRoute requireRole="Doctor">
            <DoctorDashboard />
          </ProtectedRoute>}
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute requireRole="Doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute requireRole="Doctor">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/records"
        element={
          <ProtectedRoute requireRole="Doctor">
            <DoctorMedicalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/records"
        element={
          <ProtectedRoute requireRole="Doctor">
            <MedicalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:patientId"
        element={
          <ProtectedRoute requireRole="Doctor">
            <DoctorPatientView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/:id"
        element={
          <ProtectedRoute>
            <AppointmentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-records/:id"
        element={
          <ProtectedRoute>
            <MedicalRecordDetails />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route path="/admin/dashboard"
        element={
          <ProtectedRoute requireRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>}
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute requireRole="Admin">
            <AdminDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute requireRole="Admin">
            <AdminPatients />
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/"
        element={isAuthenticated ? (user?.role === 'Patient' ? <Navigate to="/patient/dashboard" replace /> : <Navigate to="/doctor/dashboard" replace />) :
          (<Navigate to="/login" replace />)}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;