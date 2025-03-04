import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the JWT token
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuth = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            toast.error("You need to log in to access the dashboard..");
            navigate("/onboarding");
            return;
        }

        // Decode the token
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("access_token");
            toast.error("Session expired. You need to log in again.");
            navigate("/onboarding");
        } else {
            // Calculate the remaining time until the token expires
            const remainingTime = decodedToken.exp * 1000 - currentTime * 1000;

            // Set a timeout to log the user out after the remaining time
            const expirationTimeout = setTimeout(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("id");
                localStorage.removeItem("username");
                toast.error("Session expired. You need to log in again.");
                navigate("/onboarding");
            }, remainingTime);

            // Inactivity timeout
            let inactivityTimeout;
            const resetInactivityTimeout = () => {
                if (inactivityTimeout) clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("id");
                    localStorage.removeItem("username");
                    toast.error("You have been logged out due to inactivity.");
                    navigate("/onboarding");
                }, 5 * 60 * 1000); // 5 minutes of inactivity
            };
            // Event listeners to detect user activity
            const activityEvents = [
                "mousemove",
                "keydown",
                "click",
                "scroll",
                "touchstart",
            ];
            activityEvents.forEach((event) =>
                window.addEventListener(event, resetInactivityTimeout),
            );

            // Initialize inactivity timeout
            resetInactivityTimeout();

            // Cleanup on component unmount
            return () => {
                clearTimeout(expirationTimeout);
                clearTimeout(inactivityTimeout);
                activityEvents.forEach((event) =>
                    window.removeEventListener(event, resetInactivityTimeout),
                );
            };
        }
    }, [navigate]);
};

export default useAuth;
