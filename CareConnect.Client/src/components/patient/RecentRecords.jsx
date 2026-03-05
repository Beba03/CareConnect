import { FileText, ChevronRight, Stethoscope, TestTube, Pill, Activity, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentRecords({ records }) {
  // Show only the 3 most recent records
  const recentRecords = records
    ?.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate))
    .slice(0, 3) || [];

  const getRecordTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'consultation':
        return <Stethoscope size={20} className="text-blue-600" />;
      case 'labresult':
        return <TestTube size={20} className="text-purple-600" />;
      case 'prescription':
        return <Pill size={20} className="text-green-600" />;
      case 'diagnosis':
        return <Activity size={20} className="text-red-600" />;
      case 'imaging':
        return <FileCheck size={20} className="text-orange-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'consultation':
        return 'text-blue-600 bg-blue-50';
      case 'labresult':
        return 'text-purple-600 bg-purple-50';
      case 'prescription':
        return 'text-green-600 bg-green-50';
      case 'diagnosis':
        return 'text-red-600 bg-red-50';
      case 'imaging':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Records</h2>
        <Link to="/patient/records" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>

      {recentRecords.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No medical records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentRecords.map((record) => (
            <Link
              key={record.recordId}
              to={`/medical-records/${record.recordId}`}
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(record.recordType)}`}>
                  {getRecordTypeIcon(record.recordType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {record.title}
                    </h3>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Dr. {record.doctorName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.recordDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}