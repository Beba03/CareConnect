import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PatientNavbar from '../components/patient/PatientNavbar';
import ProfileHeader from '../components/patient/ProfileHeader';
import ProfileInfoSection from '../components/patient/ProfileInfoSection';
import AllergiesSection from '../components/patient/AllergiesSection';
import SecuritySection from '../components/patient/SecuritySection';
import { patientService } from '../services/patientService';

export default function PatientProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const result = await patientService.getProfile();

        if (result.success) {
            setProfile(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleProfileUpdate = async (updatedData) => {
        const result = await patientService.updateProfile(updatedData);

        if (result.success) {
            await fetchProfile();
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PatientNavbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PatientNavbar />
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
            <PatientNavbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProfileHeader user={user} profile={profile} />

                <div className="space-y-6 mt-6">
                    {/* Combined Profile Information */}
                    <ProfileInfoSection
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                    />

                    {/* Allergies */}
                    <AllergiesSection />

                    {/* Security */}
                    <SecuritySection />
                </div>
            </div>
        </div>
    );
}