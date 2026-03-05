import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import { adminService } from '../services/adminService';
import {
    Users, Plus, Search, Trash2, Mail, Phone, Calendar,
    MapPin, Activity, Droplet, AlertTriangle
} from 'lucide-react';

export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => { fetchPatients(); }, []);

    useEffect(() => { applySearch(); }, [patients, searchTerm]);

    const fetchPatients = async () => {
        setLoading(true);
        const result = await adminService.getAllPatients();

        if (result.success) {
            setPatients(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const applySearch = () => {
        if (!searchTerm) {
            setFilteredPatients(patients);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = patients.filter(patient =>
            patient.firstName?.toLowerCase().includes(searchLower) ||
            patient.lastName?.toLowerCase().includes(searchLower) ||
            patient.email?.toLowerCase().includes(searchLower) ||
            patient.nhsNumber?.toLowerCase().includes(searchLower)
        );
        setFilteredPatients(filtered);
    };

    const handleDelete = async (patientId) => {
        setDeleting(patientId);
        const result = await adminService.deletePatient(patientId);

        if (result.success) {
            setPatients(patients.filter(p => p.patientId !== patientId));
            setSuccess('Patient deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error);
        }
        setDeleting(null);
        setDeleteConfirm(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AdminNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Patients Management</h1>
                        <p className="text-gray-600">Manage patient accounts and medical information</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Add Patient
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (<div className="alert alert-success mb-6">{success}</div>)}
                {error && (<div className="alert alert-error mb-6">{error}</div>)}

                {/* Search Bar */}
                <div className="card mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, or NHS number..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                </div>

                {/* Patients List */}
                {filteredPatients.length === 0 ? (
                    <div className="card text-center py-12">
                        <Users className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No patients found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {patients.length === 0
                                ? "No patients registered yet. Add your first patient to get started."
                                : "No patients match your search criteria."
                            }
                        </p>
                        {patients.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add First Patient
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.patientId}
                                className="card hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                                    {/* Patient Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {patient.firstName} {patient.middleName} {patient.lastName}
                                            </h3>

                                            {/* Info Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                {patient.gender && (
                                                    <span className="px-1 py-1 rounded-full text-sm font-medium">
                                                        {patient.gender}
                                                    </span>
                                                )}
                                                {patient.dateOfBirth && (
                                                    <span className="py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Age: {calculateAge(patient.dateOfBirth)}
                                                    </span>
                                                )}
                                                {patient.bloodType && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <Droplet size={14} />
                                                        {patient.bloodType}
                                                    </span>
                                                )}
                                                {patient.nhsNumber && (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <Activity size={14} />
                                                        NHS: {patient.nhsNumber}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Contact Info */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                {patient.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} />
                                                        <span className="truncate">{patient.email}</span>
                                                    </div>
                                                )}
                                                {patient.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} />
                                                        <span>{patient.phoneNumber}</span>
                                                    </div>
                                                )}
                                                {patient.emergencyContact && (
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle size={14} className="text-orange-500" />
                                                        <span className="truncate">Emergency: {patient.emergencyContact}</span>
                                                    </div>
                                                )}
                                                {patient.address && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} />
                                                        <span className="truncate">{patient.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {deleteConfirm === patient.patientId ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="btn-secondary text-sm"
                                                    disabled={deleting === patient.patientId}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.patientId)}
                                                    className="btn-danger text-sm"
                                                    disabled={deleting === patient.patientId}
                                                >
                                                    {deleting === patient.patientId ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="spinner"></div>Deleting...
                                                        </span>
                                                    ) : ('Confirm Delete')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(patient.patientId)}
                                                className="btn-danger flex items-center gap-2"
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}