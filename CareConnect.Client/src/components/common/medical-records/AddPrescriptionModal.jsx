import { useState } from 'react';
import { X, Pill } from 'lucide-react';
import { medicalRecordService } from '../../../services/medicalRecordService';

export default function AddPrescriptionModal({ recordId, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const prescriptionData = {
            medicationName: formData.medicationName,
            dosage: formData.dosage,
            frequency: formData.frequency,
            duration: formData.duration,
            instructions: formData.instructions || null
        };

        // recordId is passed as prop - no need for doctor to type it
        const result = await medicalRecordService.addPrescription(recordId, prescriptionData);

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
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Pill className="text-green-600" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add Prescription</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Medication Name */}
                    <div>
                        <label htmlFor="medicationName" className="label">
                            Medication Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="medicationName"
                            name="medicationName"
                            type="text"
                            value={formData.medicationName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Amoxicillin"
                            maxLength="200"
                            required
                        />
                    </div>

                    {/* Dosage */}
                    <div>
                        <label htmlFor="dosage" className="label">
                            Dosage <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="dosage"
                            name="dosage"
                            type="text"
                            value={formData.dosage}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., 500mg"
                            maxLength="100"
                            required
                        />
                    </div>

                    {/* Frequency & Duration - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="frequency" className="label">
                                Frequency <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="frequency"
                                name="frequency"
                                type="text"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., 3x daily"
                                maxLength="100"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="label">
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="duration"
                                name="duration"
                                type="text"
                                value={formData.duration}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., 7 days"
                                maxLength="100"
                                required
                            />
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label htmlFor="instructions" className="label">
                            Instructions
                        </label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            placeholder="e.g., Take with food. Complete the full course."
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional • {formData.instructions.length}/500 characters
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-green-800">
                            <strong>Note:</strong> This prescription will be automatically linked to the current medical record.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner"></div>
                                    Adding...
                                </span>
                            ) : (
                                'Add Prescription'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}