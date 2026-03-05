import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientNavbar from '../components/patient/PatientNavbar';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import AppointmentActions from '../components/common/Appointments/AppointmentActions';
import { appointmentService } from '../services/appointmentService';
import {
    Calendar, Clock, User, FileText, MapPin, Video,
    Phone, ArrowLeft, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function AppointmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isPatient, isDoctor } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        setLoading(true);
        const result = await appointmentService.getAppointmentById(id);

        if (result.success) {
            setAppointment(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleActionSuccess = () => {
        fetchAppointment(); // Refresh data
    };

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return {
                    color: 'bg-green-100 text-green-800 border-green-300',
                    icon: <CheckCircle className="text-green-600" size={24} />
                };
            case 'completed':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-300',
                    icon: <CheckCircle className="text-blue-600" size={24} />
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-800 border-red-300',
                    icon: <XCircle className="text-red-600" size={24} />
                };
            case 'noshow':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    icon: <AlertCircle className="text-yellow-600" size={24} />
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-300',
                    icon: <AlertCircle className="text-gray-600" size={24} />
                };
        }
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'videocall':
                return <Video className="text-blue-600" size={20} />;
            case 'phoneconsultation':
                return <Phone className="text-green-600" size={20} />;
            case 'gpconsultation':
                return <MapPin className="text-purple-600" size={20} />;
            case 'followup':
                return <FileText className="text-orange-600" size={20} />;
            case 'specialistreferral':
                return <User className="text-red-600" size={20} />;
            default:
                return <Calendar className="text-gray-600" size={20} />;
        }
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

    if (error || !appointment) {
        return (
            <div className="min-h-screen bg-gray-50">
                {isPatient ? <PatientNavbar /> : <DoctorNavbar />}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="alert alert-error">
                        {error || 'Appointment not found'}
                    </div>
                    <Link to="/appointments" className="btn-secondary mt-4 inline-flex items-center gap-2">
                        <ArrowLeft size={18} />
                        Back to Appointments
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(appointment.status);

    return (
        <div className="min-h-screen bg-gray-50">
            {isPatient ? <PatientNavbar /> : <DoctorNavbar />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <Link
                    to={isPatient ? "/patient/appointments" : "/doctor/appointments"}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Appointments
                </Link>

                {/* Header Card */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            {statusConfig.icon}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Appointment Details
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    ID: {appointment.appointmentId}
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${statusConfig.color}`}>
                            {appointment.status}
                        </div>
                    </div>

                    {/* Today/Past Indicator */}
                    {appointment.isToday && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                            <p className="text-blue-800 font-medium">📅 This appointment is today!</p>
                        </div>
                    )}
                    {appointment.isPast && appointment.status?.toLowerCase() !== 'completed' && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                            <p className="text-yellow-800 font-medium">⚠️ This appointment has passed</p>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Appointment Information */}
                        <div className="card">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Appointment Information
                            </h2>

                            <div className="space-y-4">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-gray-700">
                                            {new Date(appointment.appointmentDate).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Appointment Type */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    {getTypeIcon(appointment.type)}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-1">Appointment Type</p>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {appointment.type?.replace(/([A-Z])/g, ' $1').trim() || 'Standard Consultation'}
                                        </p>
                                    </div>
                                </div>

                                {/* Doctor/Patient Info */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <User className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-1">
                                            {isPatient ? 'Doctor' : 'Patient'}
                                        </p>
                                        <p className="font-semibold text-gray-800">
                                            {isPatient ? appointment.doctorName : appointment.patientName}
                                        </p>
                                        {appointment.doctorSpecialization && isPatient && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {appointment.doctorSpecialization}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reason for Visit */}
                        <div className="card">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Reason for Visit
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {appointment.reasonForVisit}
                                </p>
                            </div>
                        </div>

                        {/* Notes (if exists) */}
                        {appointment.notes && (
                            <div className="card">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    {isDoctor ? 'Your Notes' : 'Doctor\'s Notes'}
                                </h2>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {appointment.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Actions & Meta */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Actions */}
                        <AppointmentActions
                            appointment={appointment}
                            userRole={user?.role}
                            onSuccess={handleActionSuccess}
                        />

                        {/* Metadata */}
                        <div className="card">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                                Appointment Metadata
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-600">Created</p>
                                    <p className="text-gray-800 font-medium">
                                        {new Date(appointment.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Last Updated</p>
                                    <p className="text-gray-800 font-medium">
                                        {new Date(appointment.updatedAt).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Patient ID</p>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {appointment.patientId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Doctor ID</p>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {appointment.doctorId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                            <p className="text-sm text-blue-800 mb-3">
                                If you need to reschedule or have questions about this appointment,
                                please contact support.
                            </p>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Contact Support →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}