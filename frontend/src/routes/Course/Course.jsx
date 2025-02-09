import { Layout, Typography } from "antd";
import React, { useState } from "react";
import RegisterCourse from "../../components/Courses/RegisterCourse";
import Summary from "../../components/Courses/Summary";
import CourseTable from "../../components/Table/CourseTable";
import useAuth from "../../hooks/auth/useAuth";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import useUserInfo from "../../hooks/userInfo/useUserInfo";

const { Content } = Layout;
const { Title } = Typography;

const Course = ({ sidebarCollapsed }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const { userRole } = useUserInfo();
    const titleLevel = useDynamicHeadingLevel();

    useAuth();

    const handleClick = () => {
        setIsModalVisible(true);
    };

    const handleCourseRegistered = () => {
        setReload((prevState) => !prevState);
    };

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? "md:ml-[95px] lg:ml-[60px]"
                    : "md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={titleLevel}
                className={`uppercase mb-6 ${
                    sidebarCollapsed && "ml-[45px] md:ml-0"
                }`}
                style={{ fontWeight: 650, fontFamily: "Robtto" }}
            >
                {userRole !== "lecturer" ? "Student " : "Lecturer"} Course
                Information
            </Title>

            <div className="my-[2.5rem]">
                <Summary sidebarCollapsed={sidebarCollapsed} reload={reload} />
            </div>

            <div className={`${sidebarCollapsed && " ml-[45px] md:ml-0"}`}>
                <div className="my-2">
                    <button
                        onClick={handleClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Register Course
                    </button>
                </div>

                <CourseTable reload={reload} />

                <RegisterCourse
                    userRole={userRole}
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    onCourseRegistered={handleCourseRegistered}
                />
            </div>
        </Content>
    );
};

export default Course;
