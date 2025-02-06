import { Empty } from "antd"; // Import the Empty component
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications
import { getLecturerCourseStats } from "../../api/api"; // Add your student stats API
import Loader from "../Loader/Loader";
import SummaryBox from "../Utils/SummaryBox";

const Summary = ({ sidebarCollapsed }) => {
    // Hooks and state
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Retrieve userRole from local storage
    const userRole = localStorage.getItem("userRole");

    // Function to fetch lecturer stats
    const fetchLecturerStats = async () => {
        const data = await getLecturerCourseStats();
        setStats(data && Object.keys(data).length ? data : null);
    };

    // Function to fetch stats based on role
    const fetchStats = async () => {
        try {
            if (userRole === "lecturer") {
                await fetchLecturerStats();
            } else if (userRole === "student") {
                return {};
            } else {
                toast.error("User not authenticated.");
                navigate("/onboarding");
            }
        } catch (error) {
            console.error("Error fetching course statistics:", error);
            setError("Failed to load course statistics.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStats();
    }, []);


    if (loading) {
        return <Loader />;
    }

    // Render empty state
    if (!stats) {
        return <Empty description="No Course Statistics Available" />;
    }

    // Render stats
    return (
        <div
            className={`grid gap-5 lg:gap-2 ${
                sidebarCollapsed ? "grid-cols-2" : "grid-cols-2"
            }`}
        >
            {Object.entries(stats).map(([key, value]) => (
                <div key={key} className=" text-black">
                    <SummaryBox
                        title={key.replace(/_/g, " ").toUpperCase()} // Format title
                        value={value}
                        color="#1F75FE"
                    />
                </div>
            ))}
        </div>
    );
};

export default Summary;
