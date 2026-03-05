import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PatientNavbar from '../components/patient/PatientNavbar';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import AppointmentCard from '../components/common/Appointments/AppointmentCard';
import AppointmentFilters from '../components/common/Appointments/AppointmentFilters';
import BookAppointmentModal from '../components/common/Appointments/BookAppointmentModal';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Plus } from 'lucide-react';

export default function Appointments() {
    const { user, isPatient, isDoctor } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showBookModal, setShowBookModal] = useState(false);
    const [filters, setFilters] = useState({ status: 'all', timeframe: 'all' });

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [appointments, filters]);

    const fetchAppointments = async () => {
        setLoading(true);
        const result = await appointmentService.getMyAppointments();

        if (result.success) {
            setAppointments(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...appointments];

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(apt =>
                apt.status?.toLowerCase() === filters.status.toLowerCase()
            );
        }

        // Filter by timeframe using backend calculated fields
        if (filters.timeframe === 'upcoming') {
            filtered = filtered.filter(apt => apt.isUpcoming);
        } else if (filters.timeframe === 'today') {
            filtered = filtered.filter(apt => apt.isToday);
        } else if (filters.timeframe === 'past') {
            filtered = filtered.filter(apt => apt.isPast);
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        setFilteredAppointments(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleBookSuccess = () => {
        setShowBookModal(false);
        fetchAppointments();
    };

    const handleCancelSuccess = () => {
        fetchAppointments();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {isPatient ? <PatientNavbar /> : <DoctorNavbar />}
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar based on role */}
            {isPatient ? <PatientNavbar /> : <DoctorNavbar />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {isPatient ? 'My Appointments' : 'Patient Appointments'}
                        </h1>
                        <p className="text-gray-600">
                            {isPatient
                                ? 'View and manage your upcoming and past appointments'
                                : 'Manage your patient appointments and schedules'
                            }
                        </p>
                    </div>

                    {/* Book Appointment Button (Patient only) */}
                    {isPatient && (
                        <button
                            onClick={() => setShowBookModal(true)}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            Book Appointment
                        </button>
                    )}
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error mb-6">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <AppointmentFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={appointments.length}
                    filteredCount={filteredAppointments.length}
                />

                {/* Appointments List */}
                {filteredAppointments.length === 0 ? (
                    <div className="card text-center py-12">
                        <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No appointments found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {appointments.length === 0
                                ? isPatient
                                    ? "You haven't booked any appointments yet."
                                    : "No patient appointments scheduled."
                                : "No appointments match your current filters."
                            }
                        </p>
                        {isPatient && appointments.length === 0 && (
                            <button
                                onClick={() => setShowBookModal(true)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Book Your First Appointment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.appointmentId}
                                appointment={appointment}
                                userRole={user?.role}
                                onCancelSuccess={handleCancelSuccess}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Book Appointment Modal (Patient only) */}
            {isPatient && showBookModal && (
                <BookAppointmentModal
                    onClose={() => setShowBookModal(false)}
                    onSuccess={handleBookSuccess}
                />
            )}
        </div>
    );
}