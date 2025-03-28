import { Empty, Table } from "antd";
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

    const customFontFamily = "Roboto, sans-serif";
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
    }, [pagination, reload]);

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

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columns = [
        {
            title: <span style={{ fontFamily: customFontFamily }}>S/N</span>,
            key: "sn",
            render: (_text, _record, index) => {
                return (
                    (pagination.current - 1) * pagination.pageSize + index + 1
                );
            },
            width: "5%",
        },
        ...getCourseTableHeaders(userRole).map((column) => ({
            ...column,
            title: (
                <span style={{ fontFamily: customFontFamily }}>
                    {column.title}
                </span>
            ),
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        })),
    ];

    return (
        <div
            className="my-[1.2rem] md:mt-0 lg:p-0"
            style={{ fontFamily: customFontFamily }}
        >
            {loading ? (
                <Loader />
            ) : courses.length > 0 ? (
                <Table
                    style={{
                        whiteSpace: "nowrap",
                        marginBottom: "24px",
                        fontFamily: customFontFamily,
                    }}
                    columns={columns}
                    dataSource={courses}
                    rowKey="course_code"
                    pagination={{
                        ...pagination,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize });
                        },
                        pageSizeOptions: ["5", "8", "10"],
                    }}
                    bordered
                    scroll={{ x: true }}
                />
            ) : (
                <Empty
                    description={
                        <span style={{ fontFamily: customFontFamily }}>
                            No course data available
                        </span>
                    }
                />
            )}
        </div>
    );
};

export default CourseTable;
