import { useState } from 'react';
import { Calendar, Clock, User, FileText, X, Check, Video, MapPin } from 'lucide-react';
import { appointmentService } from '../../../services/appointmentService';
import { Link } from 'react-router-dom';

export default function AppointmentCard({ appointment, userRole, onCancelSuccess }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
      case 'virtual':
        return <Video className="text-blue-600" size={16} />;
      case 'inperson':
        return <MapPin className="text-green-600" size={16} />;
      case 'followup':
        return <FileText className="text-purple-600" size={16} />;
      case 'emergency':
        return <Clock className="text-red-600" size={16} />;
      default:
        return <Calendar className="text-gray-600" size={16} />;
    }
  };

  const canCancel = () => {
    return appointment.status?.toLowerCase() !== 'cancelled' &&
           appointment.status?.toLowerCase() !== 'completed' &&
           !appointment.isPast;
  };

  const handleCancel = async () => {
    setCancelling(true);
    const result = await appointmentService.cancelAppointment(appointment.appointmentId);

    if (result.success) {
      onCancelSuccess();
      setShowCancelConfirm(false);
    }
    setCancelling(false);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Status & Type Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`badge ${getStatusColor(appointment.status)}`}>
            {appointment.status || 'Pending'}
          </span>
          {appointment.type && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {getTypeIcon(appointment.type)}
              {appointment.type}
            </span>
          )}
        </div>
        {appointment.isPast && (
          <span className="text-xs text-gray-500">Past</span>
        )}
        {appointment.isToday && (
          <span className="text-xs font-medium text-blue-600">Today</span>
        )}
      </div>

      {/* Appointment Details */}
      <div className="space-y-3">
        {/* Doctor/Patient Name */}
        <div className="flex items-start gap-3">
          <User className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-gray-600">
              {userRole === 'patient' ? 'Doctor' : 'Patient'}
            </p>
            <p className="font-semibold text-gray-800">
              {userRole === 'patient'
                ? appointment.doctorName
                : appointment.patientName
              }
            </p>
            {appointment.doctorSpecialization && userRole === 'patient' && (
              <p className="text-xs text-gray-500">{appointment.doctorSpecialization}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-400 flex-shrink-0" size={18} />
          <span className="text-sm text-gray-700">
            {new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <Clock className="text-gray-400 flex-shrink-0" size={18} />
          <span className="text-sm text-gray-700">
            {new Date(appointment.appointmentDate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Reason for Visit */}
        {appointment.reasonForVisit && (
          <div className="flex items-start gap-3">
            <FileText className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="text-sm text-gray-800">{appointment.reasonForVisit}</p>
            </div>
          </div>
        )}

        {/* Notes (Doctor only or after appointment) */}
        {appointment.notes && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-800 mb-1">Notes</p>
            <p className="text-sm text-yellow-900">{appointment.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2">
        <Link
          to={`/appointments/${appointment.appointmentId}`}
          className="btn-secondary flex-1 text-center text-sm"
        >
          View Details
        </Link>

        {canCancel() && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="btn-danger flex-1 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-3">
            Are you sure you want to cancel this appointment?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
              disabled={cancelling}
            >
              <X size={16} />
              No, Keep It
            </button>
            <button
              onClick={handleCancel}
              className="btn-danger flex-1 text-sm flex items-center justify-center gap-1"
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <div className="spinner"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Yes, Cancel
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}