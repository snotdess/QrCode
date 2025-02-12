import { Alert, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useLecturerAttendance } from "../../hooks/attendance/useLecturerAttendance";
import useLecturerCourses from "../../hooks/useLecturerCourses";
import Loader from "../Loader/Loader";
import StudentAttendance from "../Table/StudentAttendance";

const { Option } = Select;

const LecturerAttendanceComponent = () => {
    const {
        courses: lecturerCourses,
        loading: loadingCourses,
        error: coursesError,
    } = useLecturerCourses();
    const [courseCode, setCourseCode] = useState("");
    const {
        attendanceData,
        loading: loadingAttendance,
        error: attendanceError,
    } = useLecturerAttendance(courseCode);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // Set default course code if not set.
    useEffect(() => {
        if (lecturerCourses && lecturerCourses.length > 0 && !courseCode) {
            setCourseCode(lecturerCourses[0].course_code);
        }
    }, [lecturerCourses, courseCode]);

    // Adjust pagination based on screen size.
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setPagination((prev) => ({
                ...prev,
                pageSize: width >= 1024 ? 10 : 5,
            }));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTableChange = (page, pageSize) => {
        setPagination({ current: page, pageSize });
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
                Attendance for Course:{" "}
                {attendanceData?.course_name || courseCode}
            </h2>

            {/* Course selection dropdown */}
            {loadingCourses && <Loader />}
            {lecturerCourses.length > 0 && (
                <Select
                    value={courseCode}
                    style={{ width: 255 }}
                    onChange={(value) => setCourseCode(value)}
                >
                    {lecturerCourses.map((course) => (
                        <Option
                            key={course.course_code}
                            value={course.course_code}
                        >
                            {course.course_name}
                        </Option>
                    ))}
                </Select>
            )}

            {loadingAttendance && <Loader />}
            {(coursesError || attendanceError) && (
                <Alert
                    message={coursesError || attendanceError}
                    type="error"
                    showIcon
                />
            )}

            {/* Attendance table or empty state */}
            {attendanceData && (
                <StudentAttendance
                    attendanceData={attendanceData}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            )}
        </div>
    );
};

export default LecturerAttendanceComponent;
