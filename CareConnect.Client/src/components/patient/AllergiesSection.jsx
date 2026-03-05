import { useState, useEffect } from 'react';
import {
  AlertTriangle, Plus, Edit2, Trash2, AlertCircle,
  Pill, Apple, Wind, Circle
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import AllergiesModal from './AllergiesModal';

export default function AllergiesSection() {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    setLoading(true);
    const result = await patientService.getAllergies();

    if (result.success) {
      setAllergies(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingAllergy(null);
    setShowModal(true);
  };

  const handleEdit = (allergy) => {
    setEditingAllergy(allergy);
    setShowModal(true);
  };

  const handleDelete = async (allergyId) => {
    const result = await patientService.deleteAllergy(allergyId);

    if (result.success) {
      setAllergies(allergies.filter(a => a.allergyId !== allergyId));
      setDeleteConfirm(null);
    } else {
      setError(result.error);
    }
  };

  const handleSave = async (allergyData) => {
    let result;

    if (editingAllergy) {
      result = await patientService.updateAllergy(editingAllergy.allergyId, allergyData);
    } else {
      result = await patientService.addAllergy(allergyData);
    }

    if (result.success) {
      await fetchAllergies();
      setShowModal(false);
      setEditingAllergy(null);
      return { success: true };
    }

    return { success: false, error: result.error };
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'severe':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'mild':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'drug':
        return <Pill className="text-purple-600" size={20} />;
      case 'food':
        return <Apple className="text-green-600" size={20} />;
      case 'environmental':
        return <Wind className="text-blue-600" size={20} />;
      case 'other':
        return <AlertCircle className="text-gray-600" size={20} />;
      default:
        return <Circle className="text-gray-600" size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'drug':
        return 'bg-purple-50';
      case 'food':
        return 'bg-green-50';
      case 'environmental':
        return 'bg-blue-50';
      case 'other':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Allergies</h2>
              <p className="text-sm text-gray-600">Manage your known allergies and reactions</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Allergy
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {allergies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 mb-4">No allergies recorded</p>
            <button onClick={handleAdd} className="btn-primary">
              Add Your First Allergy
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {allergies.map((allergy) => (
              <div
                key={allergy.allergyId}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(allergy.allergyType)}`}>
                        {getTypeIcon(allergy.allergyType)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{allergy.allergyName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {allergy.allergyType}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getSeverityColor(allergy.severity)}`}>
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {allergy.reaction && (
                      <div className="mt-3 pl-11 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Reaction:</p>
                        <p className="text-sm text-gray-800">{allergy.reaction}</p>
                      </div>
                    )}

                    <p className="text-xs mt-3 pl-11 text-gray-500">
                      Recorded: {new Date(allergy.recordedDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(allergy)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(allergy.allergyId)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === allergy.allergyId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Are you sure you want to delete this allergy?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn-secondary text-sm flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(allergy.allergyId)}
                        className="btn-danger text-sm flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Keep your allergy information up to date.
              This information is critical for your healthcare providers when prescribing medications or treatments.
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <AllergiesModal
          allergy={editingAllergy}
          onClose={() => {
            setShowModal(false);
            setEditingAllergy(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}