import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function RegisterCard() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', email: '', phone: '',
        dateOfBirth: '', gender: '', password: '', confirmPassword: ''
    });
    const { register } = useAuth();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (errors[name]) { setErrors({ ...errors, [name]: '' }); }
    };

    const validateForm = () => {
        const newErrors = {};

        const nameRegex = /^[a-zA-Z\s\-']+$/; // Name validation regex - only letters, spaces, hyphens, apostrophes

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
        }

        if (formData.middleName && formData.middleName.trim()) {
            if (!nameRegex.test(formData.middleName)) {
                newErrors.middleName = 'Middle name can only contain letters, spaces, hyphens, and apostrophes';
            }
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (!nameRegex.test(formData.lastName)) {
            newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Phone validation (UK format)
        const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid UK phone number';
        }

        // Date of birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const age = Math.floor((new Date() - new Date(formData.dateOfBirth)) / 31557600000);
            if (age < 16) {
                newErrors.dateOfBirth = 'You must be at least 16 years old';
            }
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select your gender';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);

        const userData = {
            firstName: formData.firstName, middleName: formData.middleName,
            lastName: formData.lastName, email: formData.email,
            phone: formData.phone, dateOfBirth: formData.dateOfBirth,
            gender: formData.gender, password: formData.password
        };

        const result = await register(userData);

        if (result.success) {
            navigate('/login', {
                state: { message: 'Registration successful! Please log in with your credentials.' }
            });
        } else { setErrors({ submit: result.error }); }

        setLoading(false);
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Patient Account</h2>
                <p className="text-gray-600 text-sm mt-1">Fill in your details to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Fields - Three columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="label">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <p className="error-text">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Middle Name - OPTIONAL */}
                    <div>
                        <label htmlFor="middleName" className="label">
                            Middle Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <input
                            id="middleName"
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className={`input-field ${errors.middleName ? 'input-error' : ''}`}
                            placeholder="David"
                        />
                        {errors.middleName && (
                            <p className="error-text">{errors.middleName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="label">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                            placeholder="Smith"
                        />
                        {errors.lastName && (
                            <p className="error-text">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="label">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                        placeholder="john.smith@example.com"
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="error-text">{errors.email}</p>
                    )}
                </div>

                {/* Phone & DOB - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="label">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`input-field ${errors.phone ? 'input-error' : ''}`}
                            placeholder="07123 456789"
                        />
                        {errors.phone && (
                            <p className="error-text">{errors.phone}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dateOfBirth" className="label">
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`input-field ${errors.dateOfBirth ? 'input-error' : ''}`}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.dateOfBirth && (
                            <p className="error-text">{errors.dateOfBirth}</p>
                        )}
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="label">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`input-field ${errors.gender ? 'input-error' : ''}`}
                    >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                    {errors.gender && (
                        <p className="error-text">{errors.gender}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="label">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && (<p className="error-text">{errors.password}</p>)}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="label">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="error-text">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2 pt-2">
                    <input type="checkbox" id="terms" required className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                            Terms & Conditions
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-primary w-full mt-6"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="spinner"></div>
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-4 bg-white text-gray-500 text-sm">Already have an account?</span>
                <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
                <ArrowLeft size={16} className="inline-block mr-1 text-blue-600" />
                <Link to="/login" className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Sign in instead
                </Link>
            </div>

        </div>
    );
}

export default RegisterCard;