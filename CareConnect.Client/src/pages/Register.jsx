import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import RegisterCard from '../components/common/RegisterCard';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br 
    from-blue-200 via-white to-blue-300 px-4 py-12">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Care<span className="text-blue-600">Connect</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Create your patient account</p>
        </div>

        <RegisterCard />

      </div>
    </div>
  );
}

export default Register;