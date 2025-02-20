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
                    ? " ml-[45px] md:ml-[55px] lg:ml-[45px]"
                    : "md:ml-[220px] lg:ml-[220px]"
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
                                Register Course
                            </button>
                        </div>
                        <CourseTable />

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
