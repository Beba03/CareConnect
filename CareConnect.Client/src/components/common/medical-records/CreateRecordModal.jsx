import { useState } from 'react';
import { X } from 'lucide-react';
import { medicalRecordService } from '../../../services/medicalRecordService';

export default function CreateRecordModal({ onClose, onSuccess, defaultPatientId = null }) {
    const [formData, setFormData] = useState({
        patientId: defaultPatientId || '',
        recordType: '',
        title: '',
        description: ''
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

        const result = await medicalRecordService.createRecord({
            patientId: parseInt(formData.patientId),
            recordType: formData.recordType,
            title: formData.title,
            description: formData.description
        });

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Create Medical Record</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Patient ID */}
                    {!defaultPatientId && (
                        <div>
                            <label htmlFor="patientId" className="label">
                                Patient ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="patientId"
                                name="patientId"
                                type="number"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter patient ID"
                                required
                            />
                        </div>
                    )}

                    {/* Record Type - No prescription here */}
                    <div>
                        <label htmlFor="recordType" className="label">
                            Record Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="recordType"
                            name="recordType"
                            value={formData.recordType}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select type</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Diagnosis">Diagnosis</option>
                            <option value="ClinicalNote">Clinical Note</option>
                            <option value="Observation">Observation</option>
                            <option value="LabResult">Lab Result</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="label">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Annual Physical Exam"
                            maxLength="200"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.title.length}/200 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="label">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="6"
                            placeholder="Enter detailed medical notes, findings, diagnoses, treatment plans, etc."
                            required
                        />
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
                                    Creating...
                                </span>
                            ) : (
                                'Create Record'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}