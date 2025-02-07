import { Typography } from "antd";
import React, { useState } from "react";
import CourseTable from "../../components/Courses/CourseTable";
import RegisterCourse from "../../components/Courses/RegisterCourse";
import Summary from "../../components/Courses/Summary";
import useAuth from "../../hooks/useAuth";
import useUserInfo from "../../hooks/useUserInfo";

const Course = ({ sidebarCollapsed }) => {
    const { Title } = Typography;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const { userRole } = useUserInfo();

    useAuth();

    // Open modal when clicking "Register Course"
    const handleClick = () => {
        setIsModalVisible(true);
    };

    // Handle modal close
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCourseRegistered = () => {
        setReload((prevState) => !prevState); // Refresh table on registration
    };

    return (
        <div
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " md:ml-[65px] lg:ml-[60px]"
                    : "md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={4}
                className="uppercase text-center mb-6"
                style={{ fontWeight: 650, fontFamily: "Robtto" }}
            >
                {userRole !== "lecturer" ? "Student " : "Lecturer"} Course
                Information
            </Title>

            {/* {userRole === "lecturer" && (

            )} */}

            <div className="my-[2.5rem]">
                <Summary sidebarCollapsed={sidebarCollapsed} reload={reload} />
            </div>

            {/* Register Course Button */}
            <div className="mt-4 md:ml-[2rem] lg:ml-0 lg:mb-[2rem]">
                <button
                    onClick={handleClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Register Course
                </button>
            </div>

            {/* Course Table */}
            <CourseTable reload={reload} />

            {/* Register Course Modal */}
            <RegisterCourse
                userRole={userRole}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCourseRegistered={handleCourseRegistered}
            />
        </div>
    );
};

export default Course;
