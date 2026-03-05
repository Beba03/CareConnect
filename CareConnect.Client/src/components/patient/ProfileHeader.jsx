import { User, Mail, Phone, Calendar } from 'lucide-react';

export default function ProfileHeader({ user, profile }) {

    const getInitials = () => {
        if (!user) return 'U';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {getInitials()}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {user?.firstName} {user?.middleName} {user?.lastName}
                    </h1>
                    <p className="text-gray-600 mb-4">Patient ID: {user?.patientId || 'N/A'}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                            <Mail size={18} />
                            <span className="text-sm">{user?.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                            <Phone size={18} />
                            <span className="text-sm">{profile?.phoneNumber || user?.phone}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span className="text-sm">
                                Age: {calculateAge(profile?.dateOfBirth || user?.dateOfBirth)} years
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                    <span className="badge badge-success">Active</span>
                </div>
            </div>
        </div>
    );
}