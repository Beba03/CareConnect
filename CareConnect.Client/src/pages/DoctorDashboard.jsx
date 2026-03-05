import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import DoctorWelcomeCard from '../components/doctor/DoctorWelcomeCard';
import DoctorQuickActions from '../components/doctor/DoctorQuickActions';
import TodayAppointments from '../components/doctor/TodayAppointments';
import RecentPatients from '../components/doctor/RecentPatients';
import StatCard from '../components/common/StatCard';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    completedToday: 0
  });
  const [appointments, setAppointments] = useState([]);
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

      if (appointmentsResult.success) {
        const allAppointments = appointmentsResult.data;
        setAppointments(allAppointments);

        // Calculate stats
        const today = allAppointments.filter(apt => apt.isToday);
        const pending = allAppointments.filter(apt =>
          apt.status?.toLowerCase() === 'scheduled'
        );
        const completedToday = today.filter(apt =>
          apt.status?.toLowerCase() === 'completed'
        );

        // Get unique patient count
        const uniquePatients = new Set(allAppointments.map(apt => apt.patientId));

        setStats({
          todayAppointments: today.length,
          totalPatients: uniquePatients.size,
          pendingAppointments: pending.length,
          completedToday: completedToday.length
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
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DoctorNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <DoctorWelcomeCard user={user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="text-blue-600" size={24} />}
            title="Today's Appointments"
            value={stats.todayAppointments}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Users className="text-green-600" size={24} />}
            title="Total Patients"
            value={stats.totalPatients}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Clock className="text-yellow-600" size={24} />}
            title="Pending Appointments"
            value={stats.pendingAppointments}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<CheckCircle className="text-purple-600" size={24} />}
            title="Completed Today"
            value={stats.completedToday}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <DoctorQuickActions />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <TodayAppointments
              appointments={appointments}
              onUpdate={fetchDashboardData}
            />
          </div>

          {/* Recent Patients */}
          <div className="lg:col-span-1">
            <RecentPatients
              appointments={appointments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}