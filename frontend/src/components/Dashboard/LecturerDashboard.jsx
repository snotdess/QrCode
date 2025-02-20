import { Layout } from "antd";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import AttendanceRecord from "../Attendance/AttendanceRecord";
import LecturerCourseStats from "../Courses/LecturerCourseStats";
import { CustomSubtitle, CustomTitle } from "../CustomTypography";
import LatestQRCodes from "../QRCode/LatestQRCodes";
const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Content } = Layout;

    const titleLevel = useDynamicHeadingLevel();

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                    ? " ml-[45px] md:ml-[55px] lg:ml-[45px]"
                    : "md:ml-[220px] lg:ml-[180px]"
            }`}
        >
            <CustomTitle level={titleLevel} className="uppercase ">
                Welcome, {fullname}
            </CustomTitle>

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
