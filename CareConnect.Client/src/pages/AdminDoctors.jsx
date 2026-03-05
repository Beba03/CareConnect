import { useState, useEffect } from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import CreateDoctorModal from '../components/admin/CreateDoctorModal';
import { adminService } from '../services/adminService';
import {
    UserCog, Plus, Search, Trash2, Mail, Phone, Award,
    Calendar, MapPin, Stethoscope
} from 'lucide-react';

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        applySearch();
    }, [doctors, searchTerm]);

    const fetchDoctors = async () => {
        setLoading(true);
        const result = await adminService.getAllDoctors();

        if (result.success) {
            setDoctors(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const applySearch = () => {
        if (!searchTerm) {
            setFilteredDoctors(doctors);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = doctors.filter(doctor =>
            doctor.firstName?.toLowerCase().includes(searchLower) ||
            doctor.lastName?.toLowerCase().includes(searchLower) ||
            doctor.email?.toLowerCase().includes(searchLower) ||
            doctor.specialization?.toLowerCase().includes(searchLower) ||
            doctor.gmcNumber?.toLowerCase().includes(searchLower)
        );
        setFilteredDoctors(filtered);
    };

    const handleDelete = async (doctorId) => {
        setDeleting(doctorId);
        const result = await adminService.deleteDoctor(doctorId);

        if (result.success) {
            setDoctors(doctors.filter(d => d.doctorId !== doctorId));
            setSuccess('Doctor deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error);
        }
        setDeleting(null);
        setDeleteConfirm(null);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        setSuccess('Doctor created successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchDoctors();
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctors Management</h1>
                        <p className="text-gray-600">Manage doctor accounts and credentials</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Add Doctor
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="alert alert-success mb-6">{success}</div>
                )}
                {error && (
                    <div className="alert alert-error mb-6">{error}</div>
                )}

                {/* Search Bar */}
                <div className="card mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, specialization, or GMC number..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {filteredDoctors.length} of {doctors.length} doctors
                    </p>
                </div>

                {/* Doctors List */}
                {filteredDoctors.length === 0 ? (
                    <div className="card text-center py-12">
                        <UserCog className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No doctors found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {doctors.length === 0
                                ? "No doctors registered yet. Add your first doctor to get started."
                                : "No doctors match your search criteria."
                            }
                        </p>
                        {doctors.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add First Doctor
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.doctorId}
                                className="card hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                                    {/* Doctor Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                                            </h3>

                                            {/* Specialization Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <Stethoscope size={14} />
                                                    {doctor.specialization}
                                                </span>
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <Award size={14} />
                                                    GMC: {doctor.gmcNumber}
                                                </span>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} />
                                                    <span className="truncate">{doctor.email}</span>
                                                </div>
                                                {doctor.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} />
                                                        <span>{doctor.phoneNumber}</span>
                                                    </div>
                                                )}
                                                {doctor.dateOfBirth && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>Age: {calculateAge(doctor.dateOfBirth)}</span>
                                                    </div>
                                                )}
                                                {doctor.address && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} />
                                                        <span className="truncate">{doctor.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {deleteConfirm === doctor.doctorId ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="btn-secondary text-sm"
                                                    disabled={deleting === doctor.doctorId}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doctor.doctorId)}
                                                    className="btn-danger text-sm"
                                                    disabled={deleting === doctor.doctorId}
                                                >
                                                    {deleting === doctor.doctorId ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="spinner"></div>
                                                            Deleting...
                                                        </span>
                                                    ) : (
                                                        'Confirm Delete'
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(doctor.doctorId)}
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

            {/* Create Doctor Modal */}
            {showCreateModal && (
                <CreateDoctorModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}