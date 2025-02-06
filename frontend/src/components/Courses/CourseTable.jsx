import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchLecturerCourses, fetchStudentCourses } from "../../utils/course";
import { getCourseTableHeaders } from "../../utils/courseTable";
import Loader from "../Loader/Loader";

const CourseTable = ({ reload }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userRole = localStorage.getItem("userRole");

    const handleRegisterCourse = () => {
        navigate("/courses/register");
    };

    const fetchAndSetCourses = async () => {
        setLoading(true);
        try {
            let coursesData = [];
            if (userRole === "lecturer") {
                coursesData = await fetchLecturerCourses();
            } else if (userRole === "student") {
                coursesData = await fetchStudentCourses();
            } else {
                toast.error("User not authenticated.");
                navigate("/onboarding");
                return;
            }

            if (!coursesData || coursesData.length === 0) {
                setCourses([]);
                setError("No courses available.");
            } else {
                setCourses(coursesData);
            }
        } catch (err) {
            setError("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetCourses();
    }, [pagination, reload]); // Depend on reload to trigger re-fetch

    // Adjust pagination pageSize based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setPagination((prev) => ({ ...prev, pageSize: 10 }));
            } else if (width >= 768) {
                setPagination((prev) => ({ ...prev, pageSize: 8 }));
            } else {
                setPagination((prev) => ({ ...prev, pageSize: 5 }));
            }
        };

        // Initial resize check
        handleResize();

        // Listen for window resize events
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columns = [
        {
            title: "S/N",
            key: "sn",
            render: (_text, _record, index) => {
                return (
                    (pagination.current - 1) * pagination.pageSize + index + 1
                );
            },
            width: "5%",
        },
        ...getCourseTableHeaders(userRole),
    ];

    return (
        <div className=" mt-[3rem] md:mt-0 md:p-[2rem] lg:p-0">
            <div className="flex gap-5 items-center justify-between mb-5">
                <Button
                    onClick={handleRegisterCourse}
                    type="primary"
                    className="text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Register New Course
                </Button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <Table
                    style={{ whiteSpace: "nowrap", marginBottom: "24px" }}
                    columns={columns}
                    dataSource={courses}
                    rowKey="course_code"
                    pagination={{
                        ...pagination,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize });
                        },
                        pageSizeOptions: ["5", "8", "10"], // Customize page size options
                    }}
                    bordered
                    scroll={{ x: true }}
                />
            )}
        </div>
    );
};

export default CourseTable;
