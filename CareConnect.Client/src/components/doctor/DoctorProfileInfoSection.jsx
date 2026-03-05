import { useState } from 'react';
import { Edit2, Save, X, Award, Building } from 'lucide-react';

export default function DoctorProfileInfoSection({ profile, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        middleName: '',
        phoneNumber: '',
        specialization: '',
        address: ''
    });

    const handleEdit = () => {
        setFormData({
            middleName: profile?.middleName || '',
            phoneNumber: profile?.phoneNumber || '',
            specialization: profile?.specialization || '',
            address: profile?.address || ''
        });
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
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
        setSuccess('');
        setLoading(true);

        const result = await onUpdate(formData);

        if (result.success) {
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Professional Information</h2>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCancel}
                            className="btn-secondary flex items-center gap-2"
                            disabled={loading}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn-primary flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="alert alert-success mb-4">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-error mb-4">
                    {error}
                </div>
            )}

            {!isEditing ? (
                // VIEW MODE
                <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">First Name</label>
                                <p className="text-gray-800 font-medium">{profile?.firstName || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="label">Middle Name</label>
                                <p className="text-gray-800 font-medium">{profile?.middleName || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="label">Last Name</label>
                                <p className="text-gray-800 font-medium">{profile?.lastName || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="label">Phone Number</label>
                                <p className="text-gray-800 font-medium">{profile?.phoneNumber || 'N/A'}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="label">Address</label>
                                <p className="text-gray-800 font-medium">{profile?.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Specialization */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Award className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <label className="label mb-1">Specialization</label>
                                    <p className="text-gray-800 font-medium">
                                        {profile?.specialization || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            {/* GMC Number */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Building className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <label className="label mb-1">GMC Number</label>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {profile?.gmcNumber || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                // EDIT MODE
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">First Name</label>
                                <p className="text-gray-800 font-medium">{profile?.firstName || 'N/A'}</p>
                            </div>

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

                            <div>
                                <label className="label">Last Name</label>
                                <p className="text-gray-800 font-medium">{profile?.lastName || 'N/A'}</p>
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="label">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="07123 456789"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="address" className="label">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Enter your full address"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    placeholder="e.g., Cardiology, General Practice"
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Building className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <label className="label mb-1">GMC Number</label>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {profile?.gmcNumber || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}