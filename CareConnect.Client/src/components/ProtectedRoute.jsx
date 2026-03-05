import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireRole }) {
    const { user, loading, isAuthenticated } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) 
        return <Navigate to="/login" replace />;
    
    // Check role if specified
    if (requireRole && user?.role !== requireRole) {
        // Redirect to appropriate dashboard based on actual role
        if (user?.role === 'patient') {
            return <Navigate to="/patient/dashboard" replace />;
        } else if (user?.role === 'doctor') {
            return <Navigate to="/doctor/dashboard" replace />;
        }else if(user?.role === 'Admin'){
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute;