
// import { Empty } from "antd";
// import React, { useEffect, useState } from "react";
// import { getLecturerCourseStudents } from "../../api/api"; // Import API function
// import Loader from "../Loader/Loader";
// import SummaryBox from "../Stats/SummaryBox"; // Import SummaryBox component

// const LecturerCourseStats = ({ sidebarCollapsed }) => {
//     const [courseData, setCourseData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await getLecturerCourseStudents();

//                 if (data.length > 0) {
//                     if (Array.isArray(data)) {
//                         setCourseData(data);
//                     } else if (data && Array.isArray(data.courses)) {
//                         setCourseData(data.courses);
//                     } else {
//                         setCourseData([]);
//                     }
//                 }
//             } catch (err) {
//                 console.error("API Error:", err);
//                 setError(err || "Failed to fetch course data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) return <Loader />;
//     if (error) return <p>Error: {error}</p>;

//     // Filter out courses that have no students
//     const coursesWithStudents = courseData.filter(
//         (course) => course.total_students > 0,
//     );

//     return (
//         <div
//             className={`grid gap-5 my-[2.5rem] w-full lg:w-[90%] ${
//                 sidebarCollapsed
//                     ? "md:grid-cols-2 sm:grid-cols-1"
//                     : "md:grid-cols-2 sm:grid-cols-1"
//             }`}
//         >
//             {coursesWithStudents.length === 0 ? (
//                 <Empty description="No course data available" />
//             ) : (
//                 coursesWithStudents.map((course, index) => (
//                     <div key={index}>
//                         <SummaryBox
//                             title={course.course_name}
//                             value={`${
//                                 course.total_students === 1
//                                     ? `${course.total_students} Student`
//                                     : `${course.total_students} Students`
//                             }`}
//                             color="#1890ff"
//                         />
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default LecturerCourseStats;



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
                    setCourseData(data.courses);
                } else {
                    setCourseData([]);
                }
            } catch (err) {
                console.error("API Error:", err);
                setError("No course data available"); // Instead of raw error message
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;

    // If there's an error, show Empty state instead of the error message
    if (error || courseData.length === 0) {
        return <Empty description="No course data available" />;
    }

    // Filter out courses that have no students
    const coursesWithStudents = courseData.filter(
        (course) => course.total_students > 0,
    );

    return (
        <div
            className={`grid gap-5 my-[2.5rem] w-full lg:w-[90%] ${
                sidebarCollapsed
                    ? "md:grid-cols-2 sm:grid-cols-1"
                    : "md:grid-cols-2 sm:grid-cols-1"
            }`}
        >
            {coursesWithStudents.length === 0 ? (
                <Empty description="No course data available" />
            ) : (
                coursesWithStudents.map((course, index) => (
                    <div key={index}>
                        <SummaryBox
                            title={course.course_name}
                            value={`${
                                course.total_students === 1
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
