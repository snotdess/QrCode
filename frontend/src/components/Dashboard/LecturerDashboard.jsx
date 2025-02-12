import { Layout, Typography } from "antd";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import LecturerCourseStats from "../Courses/LecturerCourseStats";
import LatestQRCodes from "../QRCode/LatestQRCodes";
import LecturerAttendanceComponent from "../Attendance/LecturerAttendanceComponent";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Title } = Typography;
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
            <Title
                level={titleLevel}
                className="uppercase "
                style={{
                    fontFamily: "Robtto",
                }}
            >
                Welcome, {fullname}
            </Title>

            <div className=" my-[2.5rem] grid grid-cols-1 lg:grid-cols-2 ">
                <div>
                    <Title
                        level={5}
                        style={{
                            fontFamily: "Robtto",
                        }}
                    >
                        Enrolled Student Statistics
                    </Title>
                    <LecturerCourseStats sidebarCollapsed={sidebarCollapsed} />
                </div>

                <div className="mb-6 ml-5 md:ml-0 ">
                    <Title
                        level={5}
                        style={{
                            fontFamily: "Robtto",
                        }}
                    >
                        Latest QR Codes
                    </Title>
                    <LatestQRCodes />
                </div>
            </div>

            <LecturerAttendanceComponent/>
        </Content>
    );
};

export default LecturerDashboard;
