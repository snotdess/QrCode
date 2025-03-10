import { Alert, Button, Empty, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useLecturerAttendance } from "../../hooks/attendance/useLecturerAttendance";
import useLecturerCourses from "../../hooks/useLecturerCourses";
import { exportAttendance } from "../../utils/course/course";
import { CustomSubtitle } from "../CustomTypography";
import Loader from "../Loader/Loader";
import StudentAttendanceTable from "../Table/StudentAttendanceTable";

const { Option } = Select;

const AttendanceRecord = () => {
    const customFontFamily = "Roboto, sans-serif";

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

    useEffect(() => {
        if (lecturerCourses?.length > 0 && !courseCode) {
            setCourseCode(lecturerCourses[0].course_code);
        }
    }, [lecturerCourses, courseCode]);

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

    const handleTableChange = (current, pageSize) => {
        setPagination({ current, pageSize });
    };


    return (
        <div className="my-[2.5rem]" style={{ fontFamily: customFontFamily }}>
            <CustomSubtitle>
                Attendance for Course:{" "}
                {attendanceData?.course_name || courseCode}
            </CustomSubtitle>

            {loadingCourses && <Loader />}
            {lecturerCourses.length > 0 && (
                <Select
                    value={courseCode}
                    style={{
                        width: 255,
                        fontFamily: customFontFamily,
                    }}
                    onChange={(value) => setCourseCode(value)}
                >
                    {lecturerCourses.map((course) => (
                        <Option
                            key={course.course_code}
                            value={course.course_code}
                            style={{ fontFamily: customFontFamily }}
                        >
                            {course.course_name}
                        </Option>
                    ))}
                </Select>
            )}

            {attendanceData?.attendance?.length > 0 && (
                <Button
                    type="primary"
                    className="ml-[0.02rem]"
                    onClick={() => exportAttendance(attendanceData, courseCode)}
                    style={{
                        marginTop: 16,
                        fontFamily: customFontFamily,
                    }}
                >
                    Export to Excel
                </Button>
            )}

            {loadingAttendance && <Loader />}
            {(coursesError || attendanceError) && (
                <Alert
                    message={coursesError || attendanceError}
                    type="error"
                    showIcon
                    style={{ fontFamily: customFontFamily }}
                />
            )}

            {attendanceData?.attendance?.length > 0 ? (
                <StudentAttendanceTable
                    attendanceData={attendanceData.attendance}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                />
            ) : (
                <Empty
                    className="my-[2.5rem]"
                    description="No Attendance record available"
                    style={{ fontFamily: customFontFamily }}
                />
            )}
        </div>
    );
};

export default AttendanceRecord;
