import { useState, useEffect } from 'react';
import { X, Pill, Apple, Wind, Circle, AlertTriangle, Info, Zap } from 'lucide-react';

export default function AllergyModal({ allergy, onClose, onSave }) {
  const [formData, setFormData] = useState({
    allergyName: '',
    allergyType: '',
    severity: '',
    reaction: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (allergy) {
      setFormData({
        allergyName: allergy.allergyName || '',
        allergyType: allergy.allergyType || '',
        severity: allergy.severity || '',
        reaction: allergy.reaction || ''
      });
    }
  }, [allergy]);

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

    const result = await onSave(formData);

    if (result.success) {
      onClose();
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
          <h2 className="text-xl font-bold text-gray-800">
            {allergy ? 'Edit Allergy' : 'Add New Allergy'}
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

          {/* Allergy Name */}
          <div>
            <label htmlFor="allergyName" className="label">
              Allergy Name <span className="text-red-500">*</span>
            </label>
            <input
              id="allergyName"
              name="allergyName"
              type="text"
              value={formData.allergyName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Penicillin, Peanuts, Latex"
              required
            />
          </div>

          {/* Allergy Type */}
          <div>
            <label htmlFor="allergyType" className="label">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="allergyType"
              name="allergyType"
              value={formData.allergyType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select type</option>
              <option value="Drug">Drug/Medication</option>
              <option value="Food">Food</option>
              <option value="Environmental">Environmental</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Pill size={14} className="text-purple-600" /> Drug
              </span>
              <span className="flex items-center gap-1">
                <Apple size={14} className="text-green-600" /> Food
              </span>
              <span className="flex items-center gap-1">
                <Wind size={14} className="text-blue-600" /> Environmental
              </span>
              <span className="flex items-center gap-1">
                <Circle size={14} className="text-gray-600" /> Other
              </span>
            </div>
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="label">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select severity</option>
              <option value="Mild">Mild - Minor discomfort</option>
              <option value="Moderate">Moderate - Noticeable symptoms</option>
              <option value="Severe">Severe - Significant reaction</option>
              <option value="Critical">Critical - Life-threatening</option>
            </select>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-blue-600">
                <Info size={14} /> Mild
              </span>
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle size={14} /> Moderate
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <AlertTriangle size={14} /> Severe
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <Zap size={14} /> Critical
              </span>
            </div>
          </div>

          {/* Reaction Description */}
          <div>
            <label htmlFor="reaction" className="label">
              Reaction Description
            </label>
            <textarea
              id="reaction"
              name="reaction"
              value={formData.reaction}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Describe the symptoms/reaction (e.g., skin rash, difficulty breathing, swelling)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional but recommended for medical reference
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
                  Saving...
                </span>
              ) : (
                allergy ? 'Update Allergy' : 'Add Allergy'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}