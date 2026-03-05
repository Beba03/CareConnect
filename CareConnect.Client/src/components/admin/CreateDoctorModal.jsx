import { useState } from 'react';
import { X, UserCog } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function CreateDoctorModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gmcNumber: '',
        specialization: ''
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

        const doctorData = {
            email: formData.email,
            firstName: formData.firstName,
            middleName: formData.middleName || null,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber || null,
            address: formData.address || null,
            dateOfBirth: formData.dateOfBirth,
            gmcNumber: formData.gmcNumber,
            specialization: formData.specialization
        };

        const result = await adminService.createDoctor(doctorData);

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
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UserCog className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
                    </div>
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

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="label">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label htmlFor="middleName" className="label">
                                    Middle Name
                                </label>
                                <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="label">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="dateOfBirth" className="label">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="label">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="doctor@example.com"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phoneNumber" className="label">
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="07123 456789"
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="label">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="2"
                                    placeholder="Enter full address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Professional Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* GMC Number */}
                            <div>
                                <label htmlFor="gmcNumber" className="label">
                                    GMC Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="gmcNumber"
                                    name="gmcNumber"
                                    type="text"
                                    value={formData.gmcNumber}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., 1234567"
                                    maxLength="7"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    7-digit GMC registration number
                                </p>
                            </div>

                            {/* Specialization */}
                            <div>
                                <label htmlFor="specialization" className="label">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="specialization"
                                    name="specialization"
                                    type="text"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., Cardiology"
                                    maxLength="100"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> A temporary password will be automatically generated and sent to the doctor's email address.
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
                                    Creating...
                                </span>
                            ) : (
                                'Add Doctor'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}