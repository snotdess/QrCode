import { Typography } from "antd";
import Attendance from "../Attendance";
import LecturerCourseStats from "../Courses/LecturerCourseStats";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Title } = Typography;
    return (
        <div
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                    ? " md:ml-[40px] lg:ml-[50px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={4}
                className="uppercase  mb-6"
                style={{
                    fontFamily: "Robtto",
                }}
            >
                Welcome, {fullname}
            </Title>

            <LecturerCourseStats sidebarCollapsed={sidebarCollapsed} />

            <Attendance />
        </div>
    );
};

export default LecturerDashboard;
