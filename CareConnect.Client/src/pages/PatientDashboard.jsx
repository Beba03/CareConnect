import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import PatientNavbar from '../components/patient/PatientNavbar';
import WelcomeCard from '../components/patient/WelcomeCard';
import QuickActions from '../components/patient/QuickActions';
import UpcomingAppointments from '../components/patient/UpcomingAppointments';
import RecentRecords from '../components/patient/RecentRecords';
import StatCard from '../components/common/StatCard';

import { appointmentService } from '../services/appointmentService';
import { medicalRecordService } from '../services/medicalRecordService';

import { Calendar, FileText, Clock, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalRecords: 0,
    pendingResults: 0,
    completedAppointments: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]); // ← Add this
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch appointments
      const appointmentsResult = await appointmentService.getMyAppointments();

      // Fetch medical records
      const recordsResult = await medicalRecordService.getPatientRecords(user?.patientId); // ← Add this

      if (appointmentsResult.success) {
        const allAppointments = appointmentsResult.data;
        setAppointments(allAppointments);

        // Calculate appointment stats
        const upcoming = allAppointments.filter(apt =>
          apt.isUpcoming && apt.status?.toLowerCase() !== 'cancelled'
        ).length;

        const completed = allAppointments.filter(apt =>
          apt.status?.toLowerCase() === 'completed'
        ).length;

        const pending = allAppointments.filter(apt =>
          apt.status?.toLowerCase() === 'scheduled'
        ).length;

        // Get records count
        let totalRecords = 0;
        if (recordsResult.success) {
          setRecords(recordsResult.data);
          totalRecords = recordsResult.data.length;
        }

        setStats({
          upcomingAppointments: upcoming,
          totalRecords: totalRecords,
          pendingResults: pending,
          completedAppointments: completed
        });
      } else {
        setError(appointmentsResult.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <PatientNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <WelcomeCard user={user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="text-blue-600" size={24} />}
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<FileText className="text-green-600" size={24} />}
            title="Medical Records"
            value={stats.totalRecords}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Clock className="text-yellow-600" size={24} />}
            title="Pending Appointments"
            value={stats.pendingResults}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<CheckCircle className="text-purple-600" size={24} />}
            title="Completed Visits"
            value={stats.completedAppointments}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <UpcomingAppointments
              appointments={appointments}
              onUpdate={fetchDashboardData}
            />
          </div>

          {/* Recent Records */}
          <div className="lg:col-span-1">
            <RecentRecords
              records={records}
            />
          </div>
        </div>
      </div>
    </div>
  );
}