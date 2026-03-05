import { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, Clock } from 'lucide-react';
import { medicalRecordService } from '../../../services/medicalRecordService';
import AddPrescriptionModal from './AddPrescriptionModal';

export default function PrescriptionsList({ recordId, userRole }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchPrescriptions();
    }, [recordId]);

    const fetchPrescriptions = async () => {
        setLoading(true);
        const result = await medicalRecordService.getPrescriptions(recordId);

        if (result.success) {
            setPrescriptions(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Prescriptions</h2>
                    {userRole === 'Doctor' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary text-sm flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Prescription
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-error mb-4">{error}</div>
                )}

                {prescriptions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Pill className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600 mb-3">No prescriptions added yet</p>
                        {userRole === 'Doctor' && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary text-sm"
                            >
                                Add First Prescription
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {prescriptions.map((prescription) => (
                            <div
                                key={prescription.prescriptionId}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Pill className="text-green-600" size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {prescription.medicationName}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {prescription.dosage}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                        {prescription.duration}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{prescription.frequency}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(prescription.prescribedDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {prescription.instructions && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-xs font-medium text-yellow-800 mb-1">Instructions</p>
                                        <p className="text-sm text-yellow-900">{prescription.instructions}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Prescription Modal - recordId auto passed */}
            {showAddModal && (
                <AddPrescriptionModal
                    recordId={recordId}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchPrescriptions();
                    }}
                />
            )}
        </>
    );
}