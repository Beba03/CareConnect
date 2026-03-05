import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, Check, Edit2, FileText, X } from 'lucide-react';
import { appointmentService } from '../../../services/appointmentService';

export default function AppointmentActions({ appointment, userRole, onSuccess }) {
    const navigate = useNavigate();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const canCancel = () => {
        return appointment.status?.toLowerCase() !== 'cancelled' &&
            appointment.status?.toLowerCase() !== 'completed' &&
            !appointment.isPast;
    };

    const handleCancel = async () => {
        setCancelling(true);
        const result = await appointmentService.cancelAppointment(appointment.appointmentId);

        if (result.success) {
            setShowCancelConfirm(false);
            onSuccess();
        }
        setCancelling(false);
    };

    return (
        <>
            <div className="card">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Actions</h3>

                <div className="space-y-3">



                    {/* Add/Edit Notes (Doctor only) */}
                    {userRole === 'Doctor' &&
                        (appointment.status?.toLowerCase() === 'scheduled' ||
                            appointment.status?.toLowerCase() === 'completed') && (
                            <button
                                className="btn-primary w-full flex items-center justify-center gap-2"
                                onClick={() => setShowNotesModal(true)}
                            >
                                <FileText size={18} />
                                {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                            </button>
                        )}

                    {/* Mark as Completed (Doctor only) */}
                    {userRole === 'Doctor' &&
                        appointment.status?.toLowerCase() === 'scheduled' &&
                        (appointment.isToday || appointment.isPast) && (
                            <MarkCompleteButton
                                appointmentId={appointment.appointmentId}
                                onSuccess={onSuccess}
                            />
                        )}

                    {/* Cancel Appointment */}
                    {canCancel() && !showCancelConfirm && (
                        <button
                            className="btn-danger w-full flex items-center justify-center gap-2"
                            onClick={() => setShowCancelConfirm(true)}
                        >
                            <XCircle size={18} />
                            Cancel Appointment
                        </button>
                    )}

                    {/* Cancel Confirmation */}
                    {showCancelConfirm && (
                        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                            <p className="text-sm text-red-800 font-medium mb-3">
                                Are you sure you want to cancel this appointment?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="btn-secondary flex-1 text-sm"
                                    disabled={cancelling}
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="btn-danger flex-1 text-sm"
                                    disabled={cancelling}
                                >
                                    {cancelling ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="spinner"></div>
                                            Cancelling...
                                        </span>
                                    ) : (
                                        'Yes, Cancel'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <RescheduleModal
                    appointment={appointment}
                    onClose={() => setShowRescheduleModal(false)}
                    onSuccess={() => {
                        setShowRescheduleModal(false);
                        onSuccess();
                    }}
                />
            )}

            {/* Notes Modal */}
            {showNotesModal && (
                <NotesModal
                    appointment={appointment}
                    onClose={() => setShowNotesModal(false)}
                    onSuccess={() => {
                        setShowNotesModal(false);
                        onSuccess();
                    }}
                />
            )}
        </>
    );
}

// Mark Complete Button Component
function MarkCompleteButton({ appointmentId, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleMarkComplete = async () => {
        setLoading(true);
        const result = await appointmentService.updateAppointment(appointmentId, {
            status: 'Completed'
        });

        if (result.success) {
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
            onClick={handleMarkComplete}
            disabled={loading}
        >
            {loading ? (
                <>
                    <div className="spinner"></div>
                    Updating...
                </>
            ) : (
                <>
                    <Check size={18} />
                    Mark as Completed
                </>
            )}
        </button>
    );
}

// Reschedule Modal Component
function RescheduleModal({ appointment, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        appointmentDate: new Date(appointment.appointmentDate).toISOString().split('T')[0],
        appointmentTime: new Date(appointment.appointmentDate).toTimeString().slice(0, 5),
        type: appointment.type || '',
        reasonForVisit: appointment.reasonForVisit || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

        const updateData = {
            appointmentDate: appointmentDateTime,
            type: formData.type,
            reasonForVisit: formData.reasonForVisit
        };

        const result = await appointmentService.updateAppointment(
            appointment.appointmentId,
            updateData
        );

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Reschedule Appointment</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {/* Current Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Appointment</p>
                        <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleString('en-GB', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* New Date */}
                    <div>
                        <label htmlFor="appointmentDate" className="label">
                            New Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="appointmentDate"
                            name="appointmentDate"
                            type="date"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            className="input-field"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    {/* New Time */}
                    <div>
                        <label htmlFor="appointmentTime" className="label">
                            New Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="appointmentTime"
                            name="appointmentTime"
                            type="time"
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Appointment Type */}
                    <div>
                        <label htmlFor="type" className="label">
                            Appointment Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select type</option>
                            <option value="GPConsultation">GP Consultation</option>
                            <option value="FollowUp">Follow Up</option>
                            <option value="VideoCall">Video Call</option>
                            <option value="PhoneConsultation">Phone Consultation</option>
                            <option value="SpecialistReferral">Specialist Referral</option>
                        </select>
                    </div>

                    {/* Reason */}
                    <div>
                        <label htmlFor="reasonForVisit" className="label">
                            Reason for Visit <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reasonForVisit"
                            name="reasonForVisit"
                            value={formData.reasonForVisit}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            maxLength="500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.reasonForVisit.length}/500 characters
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Rescheduling is subject to doctor availability.
                            You'll be notified once confirmed.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner"></div>
                                    Updating...
                                </span>
                            ) : (
                                'Reschedule'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Notes Modal Component (Doctor only)
function NotesModal({ appointment, onClose, onSuccess }) {
    const [notes, setNotes] = useState(appointment.notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await appointmentService.updateAppointment(
            appointment.appointmentId,
            { notes }
        );

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">

                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {/* Notes Field */}
                    <div>
                        <label htmlFor="notes" className="label">
                            Appointment Notes
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="input-field"
                            rows="6"
                            placeholder="Add consultation notes, diagnosis, prescriptions, or follow-up instructions..."
                            maxLength="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {notes.length}/1000 characters
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>Note:</strong> These notes will be visible to the patient
                            and stored in their medical records.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner"></div>
                                    Saving...
                                </span>
                            ) : (
                                'Save Notes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}