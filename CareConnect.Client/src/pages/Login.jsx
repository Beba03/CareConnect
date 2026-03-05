import { Link, useLocation } from 'react-router-dom';
import { Activity, Shield, Users, Lock } from 'lucide-react';
import LoginCard from '../components/common/LoginCard';

function Login() {
  const location = useLocation();
  const successMessage = location.state?.message;

  return (

    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">

      {/* Left Side*/}
      <div className="hidden lg:flex flex-col justify-center items-center px-12 xl:px-16  bg-gradient-to-br 
      from-blue-500 to-blue-700 text-white animate-fade-in h-screen sticky top-0">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <Activity size={45} />
            <h1 className="text-5xl font-bold">
              Care<span className="text-blue-300">Connect</span>
            </h1>
          </div>

          <p className="text-xl leading-relaxed mb-8">
            A secure and modern medical platform designed to connect patients,
            doctors, and healthcare providers seamlessly.
          </p>

          <ul className="space-y-6 text-xl">
            <li className="flex items-center gap-3">
              <Shield size={25} className="flex-shrink-0" />
              <span>Secure access to medical services</span>
            </li>
            <li className="flex items-center gap-3">
              <Users size={25} className="flex-shrink-0" />
              <span>Trusted by healthcare professionals</span>
            </li>
            <li className="flex items-center gap-3">
              <Lock size={25} className="flex-shrink-0" />
              <span>Built with privacy and safety in mind</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side*/}
      <div className="flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success mb-6 animate-fade-in">
              {successMessage}
            </div>
          )}
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Activity className="text-blue-600" size={36} />
              <h1 className="text-3xl font-bold text-gray-800">
                Care<span className="text-blue-600">Connect</span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm">Secure Medical Platform</p>
          </div>

          <LoginCard />
        </div>
      </div>

    </div>
  );
}

export default Login;
