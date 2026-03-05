import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleMicrosoftLogin = () => {
    // Redirect to the backend Microsoft OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/microsoft-login`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-right">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
        <p className="text-gray-600 text-sm mt-1">Access your account</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* Microsoft Login Button */}
      <button
        onClick={handleMicrosoftLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-5"
      >
        {/* Microsoft Logo SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="20" height="20">
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="11" y="1" width="9" height="9" fill="#00a4ef" />
          <rect x="1" y="11" width="9" height="9" fill="#7fba00" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Sign in with Microsoft</span>
      </button>

      {/* Divider */}
      <div className="flex items-center mb-5">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-4 bg-white text-gray-500 text-sm">or sign in with email</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="label mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pr-10"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full mt-5"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="spinner"></div>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-4 bg-white text-gray-500 text-sm">New to CareConnect?</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <Link to="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
          Register as Patient
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

    </div>
  );
}

export default LoginCard;