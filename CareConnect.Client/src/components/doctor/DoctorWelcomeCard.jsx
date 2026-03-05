import { Stethoscope } from 'lucide-react';

export default function DoctorWelcomeCard({ user }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getDate = () => {
        return new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="card mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {getGreeting()}, Dr. {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-blue-100 mb-1">{getDate()}</p>
                </div>
                <div className="hidden md:block p-4 rounded-full">
                    <Stethoscope size={48} />
                </div>
            </div>
        </div>
    );
}