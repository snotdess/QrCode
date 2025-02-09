import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { getLecturerCourseStudents } from "../../api/api"; // Import API function
import Loader from "../Loader/Loader";
import SummaryBox from "../Stats/SummaryBox"; // Import SummaryBox component

const LecturerCourseStats = ({ sidebarCollapsed }) => {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLecturerCourseStudents();

                if (Array.isArray(data)) {
                    setCourseData(data);
                } else if (data && Array.isArray(data.courses)) {
                    setCourseData(data.courses); // Handle nested response
                } else {
                    setCourseData([]); // Prevent map() errors
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err.message || "Failed to fetch course data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div
            className={`grid gap-5 my-[2.5rem] lg:gap-10 w-full ${
                sidebarCollapsed
                    ? " md:grid-cols-2 sm:grid-cols-1"
                    : " md:grid-cols-2 sm:grid-cols-1"
            }`}
        >
            {courseData.length === 0 ? (
                <Empty description="No course data available" />
            ) : (
                courseData.map((course, index) => (
                    <div
                        key={index}
                        className={`${sidebarCollapsed && "md:ml-0 ml-[5px]"}`}
                    >
                        <SummaryBox
                            title={`${course.course_name}`}
                            value={`${
                                course.total_students === 1 ||
                                course.total_students === 0
                                    ? `${course.total_students} Student`
                                    : `${course.total_students} Students`
                            }`}
                            color="#1890ff"
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default LecturerCourseStats;
