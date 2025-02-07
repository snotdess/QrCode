import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { getLecturerCourseStudents } from "../../api/api"; // Import API function
import Loader from "../Loader/Loader";
import SummaryBox from "../Utils/SummaryBox"; // Import SummaryBox component

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
    if (courseData.length === 0)
        return <Empty description="No course data available" />;

    return (
        <div
            className={`grid gap-5 my-[2.5rem] lg:gap-10 w-full md:w-[70%] lg:w-[50%] ${
                sidebarCollapsed ? "grid-cols-2 lg:ml-0" : "grid-cols-2"
            }`}
        >
            {courseData.map((course, index) => (
                <SummaryBox
                    key={index}
                    title={course.course_name}
                    // value={`${course.total_students} students`}
                    value={`${
                        course.total_students === 1
                            ? `${course.total_students} Student`
                            : `${course.total_students} Students`
                    }`}
                    color="#1890ff" // You can set dynamic colors if needed
                />
            ))}
        </div>
    );
};

export default LecturerCourseStats;
