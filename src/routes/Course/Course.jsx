import { Layout, Typography } from "antd";
import React, { useState } from "react";
import RegisterCourse from "../../components/Courses/RegisterCourse";
import Summary from "../../components/Courses/Summary";
import { CustomTitle } from "../../components/CustomTypography";
import CourseTable from "../../components/Table/CourseTable";
import useAuth from "../../hooks/auth/useAuth";
import useUserInfo from "../../hooks/userInfo/useUserInfo";

const { Content } = Layout;
const { Title } = Typography;

const Course = ({ sidebarCollapsed }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const { userRole } = useUserInfo();

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
                    ? " ml-[20px] md:ml-[105px]  px-6 md:px-30 lg:px-40"
                    : " ml-[20px] md:ml-[215px] lg:ml-[175px] px-6 md:px-30 lg:px-40"
            }`}
        >
            <CustomTitle className="uppercase mb-6" style={{ fontWeight: 650 }}>
                Lecturer Course Information
            </CustomTitle>

            <div className="my-[2.5rem]">
                <Summary sidebarCollapsed={sidebarCollapsed} reload={reload} />
            </div>

            <div>
                {userRole != "student" && (
                    <div className="">
                        <div className="my-2">
                            <button
                                onClick={handleClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Create Course
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
                )}
            </div>
        </Content>
    );
};

export default Course;
