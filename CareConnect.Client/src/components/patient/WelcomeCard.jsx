import { Calendar } from 'lucide-react';

export default function WelcomeCard({ user }) {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getCurrentGreeting()}, {user?.firstName}!
          </h1>
          <p className="text-blue-100 flex items-center gap-2">
            <Calendar size={16} />
            {getCurrentDate()}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-blue-100 mb-1">Your Health ID</p>
            <p className="text-xl font-mono font-bold">{user?.patientId || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}