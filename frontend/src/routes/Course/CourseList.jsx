import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import SelectedCourseTable from "../../components/Table/SelectedCourseTable";
import { fetchStudentCourses } from "../../utils/course";

const CourseList = ({ reload, sidebarCollapsed }) => {
    const { Content } = Layout;
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
            if (userRole === "student") {
                coursesData = await fetchStudentCourses();
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

    const handleTableChange = (page, pageSize) => {
        setPagination({ current: page, pageSize });
    };

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? "md:ml-[95px] lg:ml-[60px]"
                    : "md:ml-[220px] lg:ml-[140px]"
            }`}
            //    className="my-[1.2rem] md:mt-0 lg:p-0"
        >
            {loading ? (
                <Loader />
            ) : (
                <SelectedCourseTable
                    courses={courses}
                    pagination={pagination}
                    handleTableChange={handleTableChange}
                    userRole={userRole}
                />
            )}
        </Content>
    );
};

export default CourseList;
