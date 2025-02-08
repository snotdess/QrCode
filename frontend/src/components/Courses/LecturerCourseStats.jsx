

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
                sidebarCollapsed ? "grid-cols-2 lg:ml-0" : "grid-cols-2"
            }`}
        >
            {courseData.length === 0 ? (
                <Empty description="No course data available" />
            ) : (
                courseData.map((course, index) => (
                    <SummaryBox
                        key={index}
                        title={`${index + 1}. ${course.course_name}`} // Adding S/N
                        value={`${
                            course.total_students === 1 ||
                            course.total_students === 0
                                ? `${course.total_students} Student`
                                : `${course.total_students} Students`
                        }`}
                        color="#1890ff"
                    />
                ))
            )}
        </div>
    );
};

export default LecturerCourseStats;
