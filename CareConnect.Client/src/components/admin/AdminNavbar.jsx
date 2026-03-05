import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, UserCog, LogOut, Menu, X, Shield
} from 'lucide-react';

export default function AdminNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/admin/doctors', icon: <UserCog size={20} />, label: 'Doctors' },
        { to: '/admin/patients', icon: <Users size={20} />, label: 'Patients' }
    ];

    return (
        <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Shield size={24} />
                        </div>
                        <span className="text-xl font-bold">CareConnect Admin</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                            <Shield size={18} />
                            <span className="text-sm font-medium">Admin</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg mt-2"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}