import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientNavbar from '../components/patient/PatientNavbar';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import PrescriptionsList from '../components/common/medical-records/PrescriptionsList';
import EditRecordModal from '../components/common/medical-records/EditRecordModal';
import { medicalRecordService } from '../services/medicalRecordService';
import {
    ArrowLeft, Calendar, User, FileText, Edit2, Trash2,
    Stethoscope, TestTube, Pill, Activity, FileCheck
} from 'lucide-react';

export default function MedicalRecordDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isPatient, isDoctor } = useAuth();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchRecord();
    }, [id]);

    const fetchRecord = async () => {
        setLoading(true);
        const result = await medicalRecordService.getRecordById(id);

        if (result.success) {
            setRecord(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        const result = await medicalRecordService.deleteRecord(record.recordId);

        if (result.success) {
            navigate(isPatient ? '/patient/records' : '/doctor/records');
        }
        setDeleting(false);
    };

    const getRecordTypeConfig = (type) => {
        switch (type?.toLowerCase()) {
            case 'consultation':
                return {
                    icon: <Stethoscope className="text-blue-600" size={24} />,
                    color: 'bg-blue-100 text-blue-800 border-blue-300',
                    label: 'Consultation'
                };
            case 'labresult':
                return {
                    icon: <TestTube className="text-purple-600" size={24} />,
                    color: 'bg-purple-100 text-purple-800 border-purple-300',
                    label: 'Lab Result'
                };
            case 'prescription':
                return {
                    icon: <Pill className="text-green-600" size={24} />,
                    color: 'bg-green-100 text-green-800 border-green-300',
                    label: 'Prescription'
                };
            case 'diagnosis':
                return {
                    icon: <Activity className="text-red-600" size={24} />,
                    color: 'bg-red-100 text-red-800 border-red-300',
                    label: 'Diagnosis'
                };
            case 'imaging':
                return {
                    icon: <FileCheck className="text-orange-600" size={24} />,
                    color: 'bg-orange-100 text-orange-800 border-orange-300',
                    label: 'Imaging'
                };
            default:
                return {
                    icon: <FileText className="text-gray-600" size={24} />,
                    color: 'bg-gray-100 text-gray-800 border-gray-300',
                    label: type || 'Record'
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {isPatient ? <PatientNavbar /> : <DoctorNavbar />}
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="min-h-screen bg-gray-50">
                {isPatient ? <PatientNavbar /> : <DoctorNavbar />}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="alert alert-error">
                        {error || 'Record not found'}
                    </div>
                    <Link
                        to={isPatient ? "/patient/records" : "/doctor/records"}
                        className="btn-secondary mt-4 inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Back to Records
                    </Link>
                </div>
            </div>
        );
    }

    const typeConfig = getRecordTypeConfig(record.recordType);

    return (
        <div className="min-h-screen bg-gray-50">
            {isPatient ? <PatientNavbar /> : <DoctorNavbar />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <Link
                    to={isPatient ? "/patient/records" : "/doctor/records"}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Medical Records
                </Link>

                {/* Header Card */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            {typeConfig.icon}
                            <div>
                                <div className={`inline-block px-3 py-1 rounded-lg border-2 font-semibold text-sm mb-2 ${typeConfig.color}`}>
                                    {typeConfig.label}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {record.title}
                                </h1>
                            </div>
                        </div>

                        {/* Actions (Doctor only) */}
                        {isDoctor && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Edit2 size={18} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="btn-danger flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Record Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Description */}
                        <div className="card">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Record Details
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {record.description}
                                </p>
                            </div>
                        </div>

                        {/* Prescriptions */}
                        <PrescriptionsList
                            recordId={record.recordId}
                            userRole={user?.role}
                        />
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Record Information */}
                        <div className="card">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">
                                Record Information
                            </h3>

                            <div className="space-y-4">
                                {/* Record Date */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Record Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(record.recordDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Doctor */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <User className="text-purple-600 flex-shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Doctor</p>
                                        <p className="font-semibold text-gray-800">
                                            Dr. {record.doctorName}
                                        </p>
                                    </div>
                                </div>

                                {/* Patient (Doctor view) */}
                                {isDoctor && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="text-green-600 flex-shrink-0 mt-1" size={18} />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Patient</p>
                                            <p className="font-semibold text-gray-800">
                                                {record.patientName}
                                            </p>
                                            <Link to={`/doctor/patients/${record.patientId}`} className="btn-secondary text-sm flex items-center gap-1 w-fit mt-1">
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="card">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                                Metadata
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-600">Record ID</p>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {record.recordId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Created</p>
                                    <p className="text-gray-800 font-medium">
                                        {new Date(record.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Patient ID</p>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {record.patientId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Doctor ID</p>
                                    <p className="text-gray-800 font-medium font-mono">
                                        {record.doctorId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Delete Medical Record?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this medical record?
                                This action cannot be undone and will permanently remove
                                all associated data.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="btn-secondary flex-1"
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn-danger flex-1"
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="spinner"></div>
                                            Deleting...
                                        </span>
                                    ) : (
                                        'Delete Record'
                                    )}
                                </button>
                            </div>
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
                        fetchRecord();
                    }}
                />
            )}
        </div>
    );
}