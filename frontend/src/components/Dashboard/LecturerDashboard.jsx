import { Layout, Typography } from "antd";
import Attendance from "../Attendance";
import LecturerCourseStats from "../Courses/LecturerCourseStats";
import LatestQRCodes from "../QRCode/LatestQRCodes";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Title } = Typography;
    const { Content } = Layout;
    return (
        <Content
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

            <div className="grid grid-cols-1 lg:grid-cols-2 my-5">
                <div className="left">
                    <Title
                        level={4}
                        style={{
                            fontFamily: "Robtto",
                        }}
                    >
                        Enrolled Student Statistics
                    </Title>
                    <LecturerCourseStats sidebarCollapsed={sidebarCollapsed} />
                </div>

                <div className="right">
                    <Title
                        level={4}
                        style={{
                            fontFamily: "Robtto",
                        }}
                    >
                        Latest QR Codes
                    </Title>
                    <LatestQRCodes />
                </div>
            </div>

            <Attendance />
        </Content>
    );
};

export default LecturerDashboard;
