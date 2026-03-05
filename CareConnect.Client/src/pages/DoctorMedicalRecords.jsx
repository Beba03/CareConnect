import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import RecordCard from '../components/common/medical-records/RecordCard';
import RecordFilters from '../components/common/medical-records/RecordFilters';
import CreateRecordModal from '../components/common/medical-records/CreateRecordModal';
import { doctorService } from '../services/doctorService';
import { FileText, Plus } from 'lucide-react';

export default function DoctorMedicalRecords() {
    const { user } = useAuth();
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

        const result = await doctorService.getMyMedicalRecords();

        if (result.success) {
            setRecords(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        let filtered = [...records];

        if (filters.recordType !== 'all') {
            filtered = filtered.filter(record =>
                record.recordType?.toLowerCase() === filters.recordType.toLowerCase()
            );
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.title?.toLowerCase().includes(searchLower) ||
                record.description?.toLowerCase().includes(searchLower) ||
                record.patientName?.toLowerCase().includes(searchLower)
            );
        }

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
                <DoctorNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Records</h1>
                        <p className="text-gray-600">
                            Create and manage patient medical records
                        </p>
                    </div>

                    {/* Create Record Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        New Record
                    </button>
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
                                ? "You haven't created any medical records yet."
                                : "No records match your current filters."
                            }
                        </p>
                        {records.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Create First Record
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecords.map((record) => (
                            <RecordCard
                                key={record.recordId}
                                record={record}
                                userRole="doctor"
                                onUpdate={fetchRecords}
                                showPatientName={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Record Modal */}
            {showCreateModal && (
                <CreateRecordModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}