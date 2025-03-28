import { Layout, Typography } from "antd";
import useDynamicSubtitleLevel from "../../hooks/typography/useDynamicSubtitleLevel";
import AttendanceRecord from "../Attendance/AttendanceRecord";
import LecturerCourseStats from "../Courses/LecturerCourseStats";
import { CustomSubtitle, CustomTitle } from "../CustomTypography";
import LatestQRCodes from "../QRCode/LatestQRCodes";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Content } = Layout;
    const { Title } = Typography;

    const subtitleLevel = useDynamicSubtitleLevel();

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
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                    ? " ml-[45px] md:ml-[125px] lg:ml-[135px] px-6 md:px-30 lg:px-40"
                    : "md:ml-[215px] lg:ml-[185px] px-6 md:px-30 lg:px-40"
            }`}
        >
            <CustomTitle>LECTURER DASHBOARD</CustomTitle>
            <div>
                <Title level={subtitleLevel} className="mb-6 uppercase">
                    {getGreeting()}
                </Title>
                <Title level={subtitleLevel} className="uppercase">
                    Surname: {surname}
                </Title>
                <Title level={subtitleLevel} className="uppercase">
                    Firstname: {firstName}
                </Title>
            </div>

            <div className=" my-[2.5rem] flex flex-col justify-between lg:flex-row ">
                <div className="flex-[56.33%]">
                    <CustomSubtitle level={5}>
                        Enrolled Student Statistics
                    </CustomSubtitle>
                    <LecturerCourseStats sidebarCollapsed={sidebarCollapsed} />
                </div>

                <div className="mb-6 ml-5 md:ml-0 flex-[43.33%] ">
                    <CustomSubtitle level={5}>Latest QR Codes</CustomSubtitle>
                    <LatestQRCodes />
                </div>
            </div>

            <AttendanceRecord />
        </Content>
    );
};

export default LecturerDashboard;
