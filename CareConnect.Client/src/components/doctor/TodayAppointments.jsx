import { useState } from 'react';
import { Calendar, Clock, User, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';

export default function TodayAppointments({ appointments, onUpdate }) {
    const [completing, setCompleting] = useState(null);

    const todayAppointments = appointments
        .filter(apt => apt.isToday)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'badge-success';
            case 'completed':
                return 'badge-info';
            case 'cancelled':
                return 'badge-danger';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleMarkComplete = async (appointmentId) => {
        setCompleting(appointmentId);
        const result = await appointmentService.updateAppointment(appointmentId, {
            status: 'Completed'
        });

        if (result.success) {
            onUpdate();
        }
        setCompleting(null);
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
                <Link to="/doctor/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                </Link>
            </div>

            {todayAppointments.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                        <div
                            key={appointment.appointmentId}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        {appointment.patientName}
                                    </h3>
                                    <p className="text-sm text-gray-600">{appointment.reasonForVisit}</p>
                                </div>
                                <span className={`badge ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{new Date(appointment.appointmentDate).toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>Patient ID: {appointment.patientId}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/appointments/${appointment.appointmentId}`}
                                    className="btn-secondary flex-1 text-center text-sm flex items-center justify-center gap-1"
                                >
                                    View Details
                                    <ChevronRight size={16} />
                                </Link>

                                {appointment.status?.toLowerCase() === 'scheduled' && (
                                    <button
                                        onClick={() => handleMarkComplete(appointment.appointmentId)}
                                        className="btn-primary flex-1 text-sm flex items-center justify-center gap-1"
                                        disabled={completing === appointment.appointmentId}
                                    >
                                        {completing === appointment.appointmentId ? (
                                            <>
                                                <div className="spinner"></div>
                                                Completing...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={16} />
                                                Mark Complete
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}