import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { patientService } from '../../services/patientService';

export default function SecuritySection() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    const result = await patientService.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    if (result.success) {
      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Lock className="text-gray-700" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
          <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="label">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              className="input-field pr-10"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="label">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              className="input-field pr-10"
              placeholder="Minimum 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field pr-10"
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="spinner"></div>
              Updating Password...
            </span>
          ) : (
            'Change Password'
          )}
        </button>
      </form>
    </div>
  );
}