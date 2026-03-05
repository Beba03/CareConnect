import { User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentPatients({ appointments }) {
    // Get unique patients from recent appointments
    const uniquePatients = [];
    const seenPatients = new Set();

    appointments
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
        .forEach(apt => {
            if (!seenPatients.has(apt.patientId) && uniquePatients.length < 5) {
                seenPatients.add(apt.patientId);
                uniquePatients.push({
                    patientId: apt.patientId,
                    patientName: apt.patientName,
                    lastVisit: apt.appointmentDate,
                    status: apt.status
                });
            }
        });

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>
                <Link to="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                </Link>
            </div>

            {uniquePatients.length === 0 ? (
                <div className="text-center py-12">
                    <User className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No recent patients</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {uniquePatients.map((patient) => (
                        <Link
                            key={patient.patientId}
                            to={`/doctor/patients/${patient.patientId}`}
                            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-full">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm">
                                            {patient.patientName}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            ID: {patient.patientId}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}