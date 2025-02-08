import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getLecturerCourseStats, getStudentCourseStats } from "../../api/api";
import Loader from "../Loader/Loader";
import SummaryBox from "../Utils/SummaryBox";

const Summary = ({
    sidebarCollapsed,
    reload,
    fetchStudentStats,
    showEmptyState,
}) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem("userRole");

    const fetchStats = async () => {
        setLoading(true);
        try {
            if (userRole === "lecturer") {
                const data = await getLecturerCourseStats();
                setStats(data && Object.keys(data).length ? data : null);
            } else if (userRole === "student" && fetchStudentStats) {
                const data = await getStudentCourseStats();
                setStats(data && Object.keys(data).length ? data : null);
            } else if (!userRole) {
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
    }, [reload]); // Re-fetch stats when `reload` changes

    if (loading) {
        return <Loader />;
    }

    if (!stats) {
        return showEmptyState ? (
            <Empty description="No Course Statistics Available" />
        ) : null;
    }

    return (
        <div
            className={` my-[2.5rem] flex gap-5 lg:gap-10 w-full md:w-[90%] lg:w-[50%]    ${
                sidebarCollapsed
                    ? " md:ml-[5px] lg:ml-[0px]"
                    : "md:ml-[0px] lg:ml-[0px]"
            }`}
        >
            {Object.entries(stats).map(([key, value]) => (
                <div
                    key={key}
                    className="text-black w-full md:w-[70%] lg:w-[50%]"
                >
                    <SummaryBox
                        title={key.replace(/_/g, " ").toUpperCase()}
                        value={value}
                        color="#1F75FE"
                    />
                </div>
            ))}
        </div>
    );
};

export default Summary;
