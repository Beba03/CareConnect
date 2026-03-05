import { useState } from 'react';
import { Edit2, Save, X, Activity, Droplet, Phone, AlertCircle } from 'lucide-react';

export default function ProfileInfoSection({ profile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    middleName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nhsNumber: '',
    bloodType: '',
    emergencyContact: ''
  });

  const handleEdit = () => {
    setFormData({
      middleName: profile?.middleName || '',
      phoneNumber: profile?.phoneNumber || '',
      address: profile?.address || '',
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || '',
      nhsNumber: profile?.nhsNumber || '',
      bloodType: profile?.bloodType || '',
      emergencyContact: profile?.emergencyContact || ''
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
        <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
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

              <div>
                <label className="label">Date of Birth</label>
                <p className="text-gray-800 font-medium">
                  {profile?.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB')
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="label">Gender</label>
                <p className="text-gray-800 font-medium capitalize">
                  {profile?.gender?.toString() || 'N/A'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="label">Address</label>
                <p className="text-gray-800 font-medium">{profile?.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NHS Number */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="text-blue-600" size={20} />
                </div>
                <div>
                  <label className="label mb-1">NHS Number</label>
                  <p className="text-gray-800 font-medium tracking-wide">
                    {profile?.nhsNumber || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Blood Type */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Droplet className="text-red-600" size={20} />
                </div>
                <div>
                  <label className="label mb-1">Blood Type</label>
                  <p className="text-gray-800 font-medium">
                    {profile?.bloodType?.toString() || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="flex items-start gap-3 md:col-span-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Phone className="text-orange-600" size={20} />
                </div>
                <div className="flex-1">
                  <label className="label mb-1">Emergency Contact</label>
                  <p className="text-gray-800 font-medium">
                    {profile?.emergencyContact || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Please ensure all information is accurate as it may be used in emergencies.
              </p>
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

              <div>
                <label htmlFor="gender" className="label">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="PreferNotToSay">Prefer not to say</option>
                </select>
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

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NHS Number */}
              <div>
                <label htmlFor="nhsNumber" className="label">
                  NHS Number
                </label>
                <input
                  id="nhsNumber"
                  name="nhsNumber"
                  type="text"
                  value={formData.nhsNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 123-456-7890"
                  pattern="[0-9\-\s]*"
                  maxLength="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 10-digit NHS number
                </p>
              </div>

              {/* Blood Type */}
              <div>
                <label htmlFor="bloodType" className="label">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select blood type</option>
                  <option value="APositive">A+</option>
                  <option value="ANegative">A-</option>
                  <option value="BPositive">B+</option>
                  <option value="BNegative">B-</option>
                  <option value="ABPositive">AB+</option>
                  <option value="ABNegative">AB-</option>
                  <option value="OPositive">O+</option>
                  <option value="ONegative">O-</option>
                </select>
              </div>

              {/* Emergency Contact */}
              <div className="md:col-span-2">
                <label htmlFor="emergencyContact" className="label">
                  Emergency Contact
                </label>
                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Name and phone number, e.g., John Smith - 07123 456789"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact number of person to contact in case of emergencies
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}