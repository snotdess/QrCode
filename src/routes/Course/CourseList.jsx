import { Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import SelectedCourseTable from "../../components/Table/SelectedCourseTable";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import { fetchAndSetCourses } from "../../utils/course/course"; // Import the helper

const CourseList = ({ reload, sidebarCollapsed }) => {
    const { Content } = Layout;
    const { Title } = Typography;
    const titleLevel = useDynamicHeadingLevel();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userRole = localStorage.getItem("userRole");

    const handleResize = () => {
        const width = window.innerWidth;
        if (width >= 1024) {
            setPagination((prev) => ({ ...prev, pageSize: 10 }));
        } else {
            setPagination((prev) => ({ ...prev, pageSize: 5 }));
        }
    };

    // Adjust pagination pageSize based on screen size
    useEffect(() => {
        // Initial resize check
        handleResize();

        // Listen for window resize events
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchAndSetCourses({
            userRole,
            navigate,
            setCourses,
            setError,
            setLoading,
        });
    }, [pagination, reload]); // Depend on reload to trigger re-fetch

    // Log courses whenever they change
    useEffect(() => {
        console.log("Fetched Courses:", courses);
    }, [courses]);

    const handleTableChange = (page, pageSize) => {
        setPagination({ current: page, pageSize });
    };

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-4 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " ml-[45px] md:ml-[75px] lg:ml-[35px] px-6 md:px-30 lg:px-40"
                    : "md:ml-[215px] lg:ml-[85px] px-6 md:px-30 lg:px-40"
            }`}
        >
            <div className="">
                <Title className=" uppercase" level={titleLevel}>
                    Selected Course List
                </Title>
            </div>
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