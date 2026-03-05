import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText, Calendar, User, ChevronRight, Edit2, Trash2,
    Stethoscope, TestTube, Pill, Activity, FileCheck
} from 'lucide-react';
import { medicalRecordService } from '../../../services/medicalRecordService';
import EditRecordModal from './EditRecordModal';

export default function RecordCard({ record, userRole, onUpdate, showPatientName = false }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getRecordTypeConfig = (type) => {
        switch (type?.toLowerCase()) {
            case 'consultation':
                return {
                    icon: <Stethoscope size={20} />,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    label: 'Consultation'
                };
            case 'labresult':
                return {
                    icon: <TestTube size={20} />,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-50',
                    label: 'Lab Result'
                };
            case 'prescription':
                return {
                    icon: <Pill size={20} />,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    label: 'Prescription'
                };
            case 'diagnosis':
                return {
                    icon: <Activity size={20} />,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    label: 'Diagnosis'
                };
            case 'imaging':
                return {
                    icon: <FileCheck size={20} />,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50',
                    label: 'Imaging'
                };
            default:
                return {
                    icon: <FileText size={20} />,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    label: type || 'Record'
                };
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        const result = await medicalRecordService.deleteRecord(record.recordId);

        if (result.success) {
            onUpdate();
        }
        setDeleting(false);
        setShowDeleteConfirm(false);
    };

    const typeConfig = getRecordTypeConfig(record.recordType);

    return (
        <>
            <div className="card hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">

                    <div className="flex items-center gap-3 mb-2">
                        {/* Type Badge */}
                        <div className={`p-3 rounded-lg ${typeConfig.bgColor}`}>
                            <div className={typeConfig.color}>
                                {typeConfig.icon}
                            </div>
                        </div>
                        {/* Type Label */}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
                            {typeConfig.label}
                        </span>
                    </div>

                    {userRole === 'doctor' && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} className="text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                    {record.title}
                </h3>

                {showPatientName && record.patientName && (
                    <div className="mb-3 flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <p className="text-sm text-gray-700 font-medium">
                            Patient: {record.patientName}
                        </p>
                    </div>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {record.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                            {new Date(record.recordDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Dr. {record.doctorName}</span>
                    </div>
                </div>

                {/* View Details Link */}
                <Link
                    to={`/medical-records/${record.recordId}`}
                    className="btn-secondary w-full text-center flex items-center justify-center gap-2"
                >
                    View Details
                    <ChevronRight size={16} />
                </Link>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700 mb-3">
                            Delete this medical record? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn-secondary flex-1 text-sm"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn-danger flex-1 text-sm"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="spinner"></div>
                                        Deleting...
                                    </span>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditRecordModal
                    record={record}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        onUpdate();
                    }}
                />
            )}
        </>
    );
}