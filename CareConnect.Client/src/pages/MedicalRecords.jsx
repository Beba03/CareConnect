import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PatientNavbar from '../components/patient/PatientNavbar';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import RecordCard from '../components/common/medical-records/RecordCard';
import RecordFilters from '../components/common/medical-records/RecordFilters';
import CreateRecordModal from '../components/common/medical-records/CreateRecordModal';
import { medicalRecordService } from '../services/medicalRecordService';
import { FileText, Plus } from 'lucide-react';

export default function MedicalRecords() {
    const { user, isPatient, isDoctor } = useAuth();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        recordType: 'all',
        searchTerm: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [records, filters]);

    const fetchRecords = async () => {
        setLoading(true);

        // Patient: fetch their own records
        // Doctor: This would need patient selection (implement later)
        const patientId = isPatient ? user?.patientId : null;

        if (!patientId && isPatient) {
            setError('Patient ID not found');
            setLoading(false);
            return;
        }

        const result = await medicalRecordService.getPatientRecords(patientId);

        if (result.success) {
            setRecords(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...records];

        // Filter by record type
        if (filters.recordType !== 'all') {
            filtered = filtered.filter(record =>
                record.recordType?.toLowerCase() === filters.recordType.toLowerCase()
            );
        }

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.title?.toLowerCase().includes(searchLower) ||
                record.description?.toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));

        setFilteredRecords(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchRecords();
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

    return (
        <div className="min-h-screen bg-gray-50">
            {isPatient ? <PatientNavbar /> : <DoctorNavbar />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Records</h1>
                        <p className="text-gray-600">
                            {isPatient
                                ? 'View your medical history and records'
                                : 'Manage patient medical records'
                            }
                        </p>
                    </div>

                    {/* Create Record Button (Doctor only) */}
                    {isDoctor && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            New Record
                        </button>
                    )}
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error mb-6">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <RecordFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={records.length}
                    filteredCount={filteredRecords.length}
                />

                {/* Records List */}
                {filteredRecords.length === 0 ? (
                    <div className="card text-center py-12">
                        <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No medical records found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {records.length === 0
                                ? isPatient
                                    ? "You don't have any medical records yet."
                                    : "No records available for this patient."
                                : "No records match your current filters."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.map((record) => (
                            <RecordCard
                                key={record.recordId}
                                record={record}
                                userRole={user?.role}
                                onUpdate={fetchRecords}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Record Modal (Doctor only) */}
            {isDoctor && showCreateModal && (
                <CreateRecordModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}