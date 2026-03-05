import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import DoctorProfileHeader from '../components/doctor/DoctorProfileHeader';
import DoctorProfileInfoSection from '../components/doctor/DoctorProfileInfoSection';
import SecuritySection from '../components/patient/SecuritySection';
import { doctorService } from '../services/doctorService';

export default function DoctorProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const result = await doctorService.getProfile();

        if (result.success) {
            setProfile(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleProfileUpdate = async (updatedData) => {
        const result = await doctorService.updateProfile(updatedData);

        if (result.success) {
            await fetchProfile();
            return { success: true };
        }

        return { success: false, error: result.error };
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DoctorNavbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="alert alert-error">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorNavbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DoctorProfileHeader user={user} profile={profile} />

                <div className="space-y-6 mt-6">
                    {/* Profile Information */}
                    <DoctorProfileInfoSection
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                    />

                    {/* Security */}
                    <SecuritySection />
                </div>
            </div>
        </div>
    );
}