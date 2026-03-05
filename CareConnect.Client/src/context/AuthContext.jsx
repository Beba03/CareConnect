import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Auth state on mount
    useEffect(() => {
        const initAuth = () => {
            const storedToken = authService.getToken();
            if (storedToken && !authService.isTokenExpired(storedToken)) {
                setToken(storedToken);
                // Decode token
                const decodedUser = authService.decodeToken(storedToken);
                setUser(decodedUser);
            } else {
                authService.logout();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Auto-logout on token expiration
    useEffect(() => {
        if (!token) return;
        // Check token expiration
        const interval = setInterval(() => {
            if (authService.isTokenExpired(token)) {
                logout();
            }
        }, 60 * 60 * 1000); // Every 1 hour
        return () => clearInterval(interval);
    }, [token]);

    // Login function
    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            const { token } = result.data;
            // Decode token
            const decodedUser = authService.decodeToken(token);

            if (!decodedUser)
                return { success: false, error: 'Invalid token received' };

            // Store token and user in state
            setToken(token);
            setUser(decodedUser);
            // Store token in localStorage
            localStorage.setItem('authToken', token);

            return { success: true };
        }
        return { success: false, error: result.error };
    };

    // Register function
    const register = async (userData) => {
        const result = await authService.register(userData);
        if (result.success)
            return { success: true };

        return { success: false, error: result.error };
    };

    // Login function for OAuth (Microsoft)
    const loginWithToken = (rawToken) => {
        const decodedUser = authService.decodeToken(rawToken);

        if (!decodedUser)
            return { success: false, error: 'Invalid token received' };

        // Store token and user in state
        setToken(rawToken);
        setUser(decodedUser);
        localStorage.setItem('authToken', rawToken);

        return { success: true };
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        authService.logout();
    };

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user && !authService.isTokenExpired(token);
    // Check user role
    const isPatient = user?.role === 'Patient';
    const isDoctor = user?.role === 'Doctor';
    const isAdmin = user?.role === 'Admin';

    const value = {
        user, token, loading, isAuthenticated,
        login, register, loginWithToken, logout, isAdmin, isPatient, isDoctor,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) { throw new Error('useAuth must be used within an AuthProvider'); }
    return context;
};