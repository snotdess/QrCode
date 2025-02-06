import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
    const location = useLocation();

    useAuth();

    useEffect(() => {
        if (location.pathname === "/courses/register") {
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    }, [location.pathname]);

    const handleCourseRegistered = () => {
        setReload((prevState) => !prevState); // Toggle reload state after course registration
    };

    return (
        <div
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                  ? " md:ml-[35px] lg:ml-[60px]"
                    : "md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={3}
                className="uppercase text-center mb-6"
                style={{ fontWeight: 650, fontFamily: "Roboto" }}
            >
                {userRole !== "lecturer" ? "Student " : "Lecturer"} Course
                Information
            </Title>

            {userRole === "lecturer" && (
                <div className="my-[2.5rem]">
                    <Summary sidebarCollapsed={sidebarCollapsed} />
                </div>
            )}

            {/* Pass reload prop to CourseTable */}
            <CourseTable reload={reload} />

            <Routes>
                <Route
                    path="register"
                    element={
                        <RegisterCourse
                            userRole={userRole}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                            onCourseRegistered={handleCourseRegistered}
                        />
                    }
                />
            </Routes>
        </div>
    );
};

export default Course;
