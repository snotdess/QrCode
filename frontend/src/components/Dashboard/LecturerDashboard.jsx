import { Layout, Typography } from "antd";

import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import LecturerCourseStats from "../Courses/LecturerCourseStats";
import LatestQRCodes from "../QRCode/LatestQRCodes";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Title } = Typography;
    const { Content } = Layout;

    const titleLevel = useDynamicHeadingLevel();

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                    ? " ml-[20px] md:ml-[95px] lg:ml-[60px]"
                    : "md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={titleLevel}
                className="uppercase mb-6 ml-5 md:ml-0 "
                style={{
                    fontFamily: "Robtto",
                }}
            >
                Welcome, {fullname}
            </Title>

            <div className=" my-[2.5rem] grid grid-cols-1 lg:grid-cols-2 ">
                <div className={`${sidebarCollapsed && "md:ml-0 ml-[20px]"}`}>
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
        </Content>
    );
};

export default LecturerDashboard;
