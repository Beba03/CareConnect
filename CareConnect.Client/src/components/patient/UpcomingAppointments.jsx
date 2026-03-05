import { useState } from 'react';
import { Calendar, Clock, ChevronRight, X, Check, Video, ClipboardPlus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';

export default function UpcomingAppointments({ appointments, onUpdate }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Use backend calculated fields instead of manual filtering
  const upcomingAppointments = appointments
    .filter(apt => apt.isUpcoming && apt.status?.toLowerCase() !== 'cancelled')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3); // Show only top 3

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'badge-success';
      case 'noshow':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      case 'completed':
        return 'badge-info';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'videocall':
        return <Video size={14} />;
      case 'gpconsultation':
        return <ClipboardPlus size={14} />;
      case 'followup':
        return <FileText size={14} />;
      default:
        return null;
    }
  };

  const handleCancel = async (appointmentId) => {
    setCancelling(true);
    const result = await appointmentService.cancelAppointment(appointmentId);

    if (result.success) {
      setCancellingId(null);
      onUpdate();
    }
    setCancelling(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
        <Link to="/patient/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>

      {upcomingAppointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">No upcoming appointments</p>
          <Link to="/patient/appointments" className="btn-primary inline-block">
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {appointment.doctorName}
                  </h3>
                  {appointment.doctorSpecialization && (
                    <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  {appointment.isToday && (
                    <span className="text-xs font-medium text-blue-600">Today</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{new Date(appointment.appointmentDate).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {appointment.type && (
                  <div className="flex items-center gap-2">
                    {getTypeIcon(appointment.type)}
                    <span className="capitalize">{appointment.type}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500 line-clamp-1">
                  {appointment.reasonForVisit || 'General consultation'}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/appointments/${appointment.appointmentId}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Details
                    <ChevronRight size={16} />
                  </Link>

                  {!appointment.isPast && appointment.status?.toLowerCase() !== 'cancelled' &&
                    appointment.status?.toLowerCase() !== 'completed' && (
                      <button
                        onClick={() => setCancellingId(appointment.appointmentId)}
                        className="text-sm text-red-600 hover:text-red-700 cursor-pointer font-medium"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>

              {/* Cancel Confirmation */}
              {cancellingId === appointment.appointmentId && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">Cancel this appointment?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCancellingId(null)}
                      className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1"
                      disabled={cancelling}
                    >
                      <X size={14} />
                      No
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.appointmentId)}
                      className="btn-danger text-xs flex-1 flex items-center justify-center gap-1"
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <>
                          <div className="spinner"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Yes, Cancel
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}