import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LecturerDashboard from "../../components/Dashboard/LecturerDashboard";
import StudentDashboard from "../../components/Dashboard/StudentDashboard";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/auth/useAuth";
import useUserInfo from "../../hooks/userInfo/useUserInfo";

const Dashboard = ({ sidebarCollapsed }) => {
    const [dashboardComponent, setDashboardComponent] = useState(null);
    const navigate = useNavigate();
    const { fullname, userRole, matNo } = useUserInfo();

    useAuth();

    useEffect(() => {
        const role = userRole || localStorage.getItem("userRole");

        // Redirect to login if no role is found
        if (!role) {
            navigate("/onboarding");
            return;
        }

        // Dynamically set the dashboard component based on role
        if (role === "student") {
            setDashboardComponent(
                <StudentDashboard
                    fullname={fullname}
                    matNo={matNo}
                    sidebarCollapsed={sidebarCollapsed}
                />,
            );
        } else if (role === "lecturer") {
            setDashboardComponent(
                <LecturerDashboard
                    fullname={fullname}
                    sidebarCollapsed={sidebarCollapsed}
                />,
            );
        } else {
            // Redirect to onboarding or error page for unknown roles
            navigate("/onboarding");
        }
    }, [userRole, fullname, matNo, navigate, sidebarCollapsed]);

    // Render the selected dashboard or a fallback loading state
    return dashboardComponent || <Loader />;
};

export default Dashboard;



