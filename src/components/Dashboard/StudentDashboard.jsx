import { Button, Layout, Typography } from "antd";
import { useState } from "react";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import useDynamicSubtitleLevel from "../../hooks/typography/useDynamicSubtitleLevel";
import useUserInfo from "../../hooks/userInfo/useUserInfo";
import StudentAttendance from "../Attendance/StudentAttendance";
import RegisterCourse from "../Courses/RegisterCourse";
import Summary from "../Courses/Summary";
import { CustomTitle } from "../CustomTypography";

const StudentDashboard = ({ fullname, matNo, sidebarCollapsed }) => {
    const { Content } = Layout;
    const titleLevel = useDynamicHeadingLevel();
    const subtitleLevel = useDynamicSubtitleLevel();
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

    // Split fullname into surname and first name
    const nameParts = fullname.split(" ");
    const surname = nameParts[0] || "";
    const firstName = nameParts.slice(1).join(" ") || "";

    // Determine greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <Content
            className={`min-h-screen mx-auto  py-2 lg:px-4 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " ml-[45px] md:ml-[75px] lg:ml-[35px] px-6 md:px-30 lg:px-40"
                    : "md:ml-[215px] lg:ml-[85px] px-6 md:px-30 lg:px-40"
            }`}
        >
            <CustomTitle>STUDENT DASHBOARD</CustomTitle>

            <div>
                <Title level={subtitleLevel} className="mb-6 uppercase">
                    {getGreeting()}
                </Title>
                <Title className="uppercase" level={subtitleLevel}>
                    Surname: {surname}
                </Title>
                <Title className="uppercase" level={subtitleLevel}>
                    Firstname: {firstName}
                </Title>
                <Title level={subtitleLevel}>Matric Number: {matNo}</Title>
            </div>

            {/* Show Summary only for students */}
            <Typography className="my-[2.5rem]">
                <Summary
                    sidebarCollapsed={sidebarCollapsed}
                    fetchStudentStats={true}
                    showEmptyState={true}
                />
            </Typography>
            <div>
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
            <StudentAttendance />

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
