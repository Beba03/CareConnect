import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, UserPlus } from 'lucide-react';

export default function DoctorQuickActions() {
    const actions = [
        {
            icon: <Calendar size={24} />,
            title: 'View Schedule',
            description: 'See all appointments',
            link: '/doctor/appointments',
            color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        },  
        {
            icon: <FileText size={24} />,
            title: 'Medical Records',
            description: 'Create & manage records',
            link: '/doctor/records',
            color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
        },
    ];

    return (
        <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className={`p-4 rounded-lg transition-all ${action.color} flex flex-col items-center text-center`}
                    >
                        <div className="mb-3">{action.icon}</div>
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-xs opacity-75">{action.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}