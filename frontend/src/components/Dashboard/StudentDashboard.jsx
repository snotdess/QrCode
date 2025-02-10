import { Button, Layout, Typography } from "antd";
import { useState } from "react";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import useUserInfo from "../../hooks/userInfo/useUserInfo";
import AttendanceRecord from "../Attendance/AttendanceRecord";
import RegisterCourse from "../Courses/RegisterCourse";
import Summary from "../Courses/Summary";

const StudentDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Content } = Layout;
    const titleLevel = useDynamicHeadingLevel();
    const { Title } = Typography;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const { userRole } = useUserInfo();

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
                    ? " md:ml-[35px] lg:ml-[60px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <div className={`mb-6 ${sidebarCollapsed && "ml-[45px] md:ml-0"}`}>
                <Title
                    style={{
                        fontFamily: "Robtto",
                    }}
                    level={titleLevel}
                    className="uppercase mb-6"
                >
                    Welcome, {fullname}
                </Title>
            </div>

            {/* Show Summary only for students */}
            <Typography className="my-[2.5rem]">
                <Summary
                    sidebarCollapsed={sidebarCollapsed}
                    fetchStudentStats={true}
                    showEmptyState={true}
                />
            </Typography>
            <div
            // className="absolute lg:right-[9.2rem]"
            >
                <Button
                    htmlType="submit"
                    onClick={handleClick}
                    type="primary"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Register Course
                </Button>
            </div>

            {/* <Attendance /> */}

            <AttendanceRecord fullname={fullname} />

            <RegisterCourse
                userRole={userRole}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCourseRegistered={handleCourseRegistered}
            />
        </Content>
    );
};

export default StudentDashboard;
