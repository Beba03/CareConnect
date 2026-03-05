import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        // Extract token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            loginWithToken(token);
            navigate("/patient/dashboard");
        } else {
            // No token means something went wrong
            navigate("/login?error=oauth_failed");
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Signing you in...</p>
        </div>
    );
};

export default OAuthCallback;