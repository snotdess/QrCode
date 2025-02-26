import { Button, Layout, Typography } from "antd";
import { useState } from "react";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import useUserInfo from "../../hooks/userInfo/useUserInfo";
import StudentAttendance from "../Attendance/StudentAttendance";
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
            className={`min-h-screen mx-auto px-8 py-2 lg:px-4 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " ml-[45px] md:ml-[55px] lg:ml-[45px]"
                    : "md:ml-[220px] lg:ml-[180px]"
            }`}
        >
            <div>
                <Title level={titleLevel} className="uppercase mb-6">
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
