import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Menu, X, User, LogOut } from 'lucide-react';

export default function PatientNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Activity className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-800">
                            Care<span className="text-blue-600">Connect</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/patient/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                            Dashboard
                        </Link>
                        <Link to="/patient/appointments" className="text-gray-700 hover:text-blue-600 font-medium">
                            Appointments
                        </Link>
                        <Link to="/patient/records" className="text-gray-700 hover:text-blue-600 font-medium">
                            Medical Records
                        </Link>
                        <Link to="/patient/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                            Profile
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* User Menu */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">Patient</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            to="/patient/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/patient/appointments"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Appointments
                        </Link>
                        <Link
                            to="/patient/records"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Medical Records
                        </Link>
                        <Link
                            to="/patient/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}