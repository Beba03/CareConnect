import { useState } from 'react';
import { X } from 'lucide-react';
import { medicalRecordService } from '../../../services/medicalRecordService';

export default function EditRecordModal({ record, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: record.title || '',
        description: record.description || '',
        recordType: record.recordType || ''
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

        const updateData = {
            title: formData.title,
            description: formData.description,
            recordType: formData.recordType
        };

        const result = await medicalRecordService.updateRecord(record.recordId, updateData);

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
                    <h2 className="text-xl font-bold text-gray-800">Edit Medical Record</h2>
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

                    {/* Record Type */}
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
                            <option value="LabResult">Lab Result</option>
                            <option value="Prescription">Prescription</option>
                            <option value="Diagnosis">Diagnosis</option>
                            <option value="Imaging">Imaging</option>
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
                            required
                        />
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
                                'Update Record'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}