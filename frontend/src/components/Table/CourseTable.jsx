import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchLecturerCourses } from "../../utils/course/course";
import { getCourseTableHeaders } from "../../utils/table/tableHeaders";
import Loader from "../Loader/Loader";

const CourseTable = ({ reload }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userRole = localStorage.getItem("userRole");

    const fetchAndSetCourses = async () => {
        setLoading(true);
        try {
            let coursesData = [];
            if (userRole === "lecturer") {
                coursesData = await fetchLecturerCourses();
            } else {
                toast.error("User not allowed.");
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
        <div className=" my-[1.2rem] md:mt-0  lg:p-0">
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
