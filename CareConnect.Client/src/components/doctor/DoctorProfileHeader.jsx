import { Stethoscope, Mail, Phone, Calendar, Award } from 'lucide-react';

export default function DoctorProfileHeader({ user, profile }) {
    const getInitials = () => {
        const first = user?.firstName?.[0] || '';
        const last = user?.lastName?.[0] || '';
        return `${first}${last}`.toUpperCase();
    };

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                        {getInitials()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-green-600 rounded-full">
                        <Stethoscope className="text-white" size={20} />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Dr. {user?.firstName} {user?.lastName}
                        {console.log(user)}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {profile?.specialization || 'General Practitioner'}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Active
                        </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} />
                            <span>{profile?.phoneNumber || 'Not provided'}</span>
                        </div>
                        {profile?.gmcNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Award size={16} />
                                <span>GMC  {profile.gmcNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}