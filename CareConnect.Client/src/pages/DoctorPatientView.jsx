import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import { medicalRecordService } from '../services/medicalRecordService';
import { doctorService } from '../services/doctorService';
import {
    ArrowLeft, User, Calendar, Droplet, Phone,
    Activity, AlertTriangle, FileText, Clock,
    Stethoscope, TestTube, Pill, FileCheck,
    Wind, Apple, AlertCircle
} from 'lucide-react';

export default function DoctorPatientView() {
    const { patientId } = useParams();
    const { user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

    const fetchPatientData = async () => {
        setLoading(true);
        setError('');

        try {
            const [patientResult, recordsResult, allergiesResult] = await Promise.all([
                doctorService.getPatientProfile(patientId),
                medicalRecordService.getPatientRecords(patientId),
                doctorService.getPatientAllergies(patientId)
            ]);

            if (patientResult.success) setPatient(patientResult.data);
            if (recordsResult.success) setRecords(recordsResult.data);
            if (allergiesResult.success) setAllergies(allergiesResult.data);

            if (!patientResult.success) setError(patientResult.error);

        } catch (err) {
            setError('Failed to load patient data');
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getRecordTypeConfig = (type) => {
        switch (type?.toLowerCase()) {
            case 'consultation':
                return { icon: <Stethoscope size={16} />, color: 'text-blue-600 bg-blue-50' };
            case 'labresult':
                return { icon: <TestTube size={16} />, color: 'text-purple-600 bg-purple-50' };
            case 'diagnosis':
                return { icon: <Activity size={16} />, color: 'text-red-600 bg-red-50' };
            case 'clinicalnote':
                return { icon: <FileText size={16} />, color: 'text-gray-600 bg-gray-50' };
            case 'observation':
                return { icon: <FileCheck size={16} />, color: 'text-orange-600 bg-orange-50' };
            default:
                return { icon: <FileText size={16} />, color: 'text-gray-600 bg-gray-50' };
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'severe': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'mild': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getAllergyIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'drug': return <Pill size={16} className="text-purple-600" />;
            case 'food': return <Apple size={16} className="text-green-600" />;
            case 'environmental': return <Wind size={16} className="text-blue-600" />;
            default: return <AlertCircle size={16} className="text-gray-600" />;
        }
    };

    const tabs = [
        { key: 'overview', label: 'Overview', icon: <User size={16} /> },
        { key: 'records', label: `Records (${records.length})`, icon: <FileText size={16} /> },
        { key: 'allergies', label: `Allergies (${allergies.length})`, icon: <AlertTriangle size={16} /> }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DoctorNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DoctorNavbar />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="alert alert-error mb-4">{error || 'Patient not found'}</div>
                    <Link to="/doctor/records" className="btn-secondary inline-flex items-center gap-2">
                        <ArrowLeft size={18} />
                        Back to Records
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorNavbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <Link
                    to="/doctor/records"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Records
                </Link>

                {/* Patient Header */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                {patient.firstName} {patient.lastName}
                            </h1>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap items-center mb-3">
                                <span className="px-1 py-1 rounded-full text-sm font-medium">
                                    Age: {calculateAge(patient.dateOfBirth)}
                                </span>
                                {patient.gender && (
                                    <span className="px-1 py-1 rounded-full text-sm font-medium">
                                        {patient.gender}
                                    </span>
                                )}
                                {patient.bloodType && (
                                    <span className="px-1 py-1 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Droplet size={14} />
                                        {patient.bloodType}
                                    </span>
                                )}
                                {allergies.length > 0 && (
                                    <span className="px-1 py-1 text-orange-500 rounded-full text-sm font-medium flex items-center gap-1">
                                        <AlertTriangle size={14} />
                                        {allergies.length} Allerg{allergies.length === 1 ? 'y' : 'ies'}
                                    </span>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {patient.phoneNumber && (
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {patient.phoneNumber}
                                    </span>
                                )}
                                {patient.nhsNumber && (
                                    <span className="flex items-center gap-1">
                                        <Activity size={14} />
                                        NHS: {patient.nhsNumber}
                                    </span>
                                )}
                                {patient.emergencyContact && (
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} className="text-orange-500" />
                                        Emergency Contact: {patient.emergencyContact}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Create Record Button */}
                        <Link
                            to={`/doctor/records?patientId=${patientId}`}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <FileText size={18} />
                            New Record
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 border border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Details */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Personal Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                {[
                                    { label: 'Full Name', value: `${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`.trim() },
                                    { label: 'Date of Birth', value: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
                                    { label: 'Age', value: `${calculateAge(patient.dateOfBirth)} years old` },
                                    { label: 'Address', value: patient.address || 'N/A' }
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between gap-4">
                                        <span className="text-gray-500 flex-shrink-0">{label}</span>
                                        <span className="text-gray-800 font-medium text-right">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medical Details */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                Medical Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                {[
                                    { label: 'NHS Number', value: patient.nhsNumber || 'Not provided' },
                                    { label: 'Total Records', value: records.length },
                                    { label: 'Known Allergies', value: allergies.length }
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between gap-4">
                                        <span className="text-gray-500 flex-shrink-0">{label}</span>
                                        <span className="text-gray-800 font-medium text-right">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Critical Allergies Warning */}
                        {allergies.some(a => a.severity?.toLowerCase() === 'critical') && (
                            <div className="md:col-span-2 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                                <div>
                                    <p className="font-bold text-red-800 mb-2">⚠️ Critical Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allergies
                                            .filter(a => a.severity?.toLowerCase() === 'critical')
                                            .map(a => (
                                                <span key={a.allergyId} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold border border-red-300">
                                                    {a.allergyName}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Records Summary */}
                        <div className="md:col-span-2 card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Records</h3>
                                <button
                                    onClick={() => setActiveTab('records')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View All
                                </button>
                            </div>
                            {records.length === 0 ? (
                                <p className="text-gray-500 text-sm">No records yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {records.slice(0, 3).map(record => {
                                        const config = getRecordTypeConfig(record.recordType);
                                        return (
                                            <Link
                                                key={record.recordId}
                                                to={`/medical-records/${record.recordId}`}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className={`p-2 rounded-lg ${config.color}`}>
                                                    {config.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-800 text-sm truncate">{record.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(record.recordDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 flex-shrink-0">{record.recordType}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* RECORDS TAB */}
                {activeTab === 'records' && (
                    <div>
                        {records.length === 0 ? (
                            <div className="card text-center py-12">
                                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                                <p className="text-gray-600 mb-4">No medical records for this patient</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {records
                                    .sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))
                                    .map(record => {
                                        const config = getRecordTypeConfig(record.recordType);
                                        return (
                                            <Link
                                                key={record.recordId}
                                                to={`/medical-records/${record.recordId}`}
                                                className="card block hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-lg flex-shrink-0 ${config.color}`}>
                                                        {config.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-1">
                                                            <h3 className="font-semibold text-gray-800">{record.title}</h3>
                                                            <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {new Date(record.recordDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{record.description}</p>
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                            {record.recordType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}

                {/* ALLERGIES TAB */}
                {activeTab === 'allergies' && (
                    <div>
                        {allergies.length === 0 ? (
                            <div className="card text-center py-12">
                                <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
                                <p className="text-gray-600">No allergies recorded for this patient</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allergies.map(allergy => (
                                    <div
                                        key={allergy.allergyId}
                                        className="card border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    {getAllergyIcon(allergy.allergyType)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 mb-1">{allergy.allergyName}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                            {allergy.allergyType}
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getSeverityColor(allergy.severity)}`}>
                                                            {allergy.severity}
                                                        </span>
                                                    </div>
                                                    {allergy.reaction && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Reaction:</span> {allergy.reaction}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 flex-shrink-0">
                                                {new Date(allergy.recordedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}