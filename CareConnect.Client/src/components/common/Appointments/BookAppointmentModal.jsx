import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { appointmentService } from '../../../services/appointmentService';
import { doctorService } from '../../../services/doctorService';

export default function BookAppointmentModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        specialization: '',
        appointmentDate: '',
        appointmentTime: '',
        type: '',
        reasonForVisit: ''
    });
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingSpecializations, setFetchingSpecializations] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        setFetchingSpecializations(true);
        const result = await doctorService.getSpecialities();

        if (result.success) {
            setSpecializations(result.data);
        } else {
            setError('Failed to load specializations');
        }
        setFetchingSpecializations(false);
    };

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

        // Combine date and time into ISO format
        const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

        const appointmentData = {
            specialization: formData.specialization,
            appointmentDate: appointmentDateTime,
            type: formData.type,
            reasonForVisit: formData.reasonForVisit
        };

        const result = await appointmentService.bookAppointment(appointmentData);

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
                    <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
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

                    {/* Specialization Selection */}
                    <div>
                        <label htmlFor="specialization" className="label">
                            Specialization <span className="text-red-500">*</span>
                        </label>
                        {fetchingSpecializations ? (
                            <div className="flex items-center justify-center py-3">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <select
                                id="specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Choose a specialization</option>
                                {specializations.map((spec, index) => (
                                    <option key={index} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            You'll be assigned to an available doctor in this specialty
                        </p>
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
                            <option value="">Select appointment type</option>
                            <option value="GPConsultation">GP Consultation</option>
                            <option value="FollowUp">Follow Up</option>
                            <option value="VideoCall">Video Call</option>
                            <option value="PhoneConsultation">Phone Consultation</option>
                            <option value="SpecialistReferral">Specialist Referral</option>
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="appointmentDate" className="label">
                            Preferred Date <span className="text-red-500">*</span>
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

                    {/* Time */}
                    <div>
                        <label htmlFor="appointmentTime" className="label">
                            Preferred Time <span className="text-red-500">*</span>
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
                        <p className="text-xs text-gray-500 mt-1">
                            Subject to doctor availability
                        </p>
                    </div>

                    {/* Reason for Visit */}
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
                            placeholder="Describe your symptoms or reason for appointment"
                            maxLength="500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.reasonForVisit.length}/500 characters
                        </p>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Your appointment will be confirmed once a doctor
                            from the selected specialization accepts your request.
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
                            disabled={loading || fetchingSpecializations}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner"></div>
                                    Booking...
                                </span>
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}