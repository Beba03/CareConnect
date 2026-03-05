import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import StatCard from '../components/common/StatCard';
import { adminService } from '../services/adminService';
import { Users, UserCog, Calendar, FileText, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicalRecords: 0,
    appointmentsToday: 0,
    newPatientsThisMonth: 0,
    newDoctorsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const result = await adminService.getStatistics();

    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of system statistics and recent activity</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">{error}</div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<UserCog className="text-blue-600" size={24} />}
            title="Total Doctors"
            value={stats.totalDoctors}
            bgColor="bg-blue-50"
            subtitle={`+${stats.newDoctorsThisMonth} this month`}
          />
          <StatCard
            icon={<Users className="text-green-600" size={24} />}
            title="Total Patients"
            value={stats.totalPatients}
            bgColor="bg-green-50"
            subtitle={`+${stats.newPatientsThisMonth} this month`}
          />
          <StatCard
            icon={<Calendar className="text-purple-600" size={24} />}
            title="Appointments"
            value={stats.totalAppointments}
            bgColor="bg-purple-50"
            subtitle={`${stats.appointmentsToday} today`}
          />
          <StatCard
            icon={<FileText className="text-orange-600" size={24} />}
            title="Medical Records"
            value={stats.totalMedicalRecords}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Doctors Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Doctors Management</h2>
              <UserCog className="text-blue-600" size={32} />
            </div>
            <p className="text-gray-600 mb-4">
              Manage doctor accounts, specializations, and credentials
            </p>
            <a href="/admin/doctors" className="btn-primary w-full text-center">
              Manage Doctors
            </a>
          </div>

          {/* Patients Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Patients Management</h2>
              <Users className="text-green-600" size={32} />
            </div>
            <p className="text-gray-600 mb-4">
              Manage patient accounts and medical information
            </p>
            <a href="/admin/patients" className="btn-primary w-full text-center">
              Manage Patients
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}