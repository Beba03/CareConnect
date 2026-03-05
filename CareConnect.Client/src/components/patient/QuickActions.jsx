import { Link } from 'react-router-dom';
import { Calendar, FileText, User, MessageSquare } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      icon: <Calendar size={24} />,
      title: 'Book Appointment',
      description: 'Schedule a visit with a doctor',
      link: '/patient/appointments',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      icon: <FileText size={24} />,
      title: 'View Records',
      description: 'Access your medical history',
      link: '/patient/records',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      icon: <User size={24} />,
      title: 'Update Profile',
      description: 'Edit your personal information',
      link: '/patient/profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Contact Support',
      description: 'Get help from our team',
      link: '/patient/support',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'bg-orange-400'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`card ${action.bgColor} transition-all hover:shadow-lg hover: ${action.hoverColor}`}
          >
            <div className={`${action.color} mb-3`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}