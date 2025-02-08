import { Layout, Typography } from "antd";
import useDynamicTitleLevel from "../../hooks/useDynamicTitleLevel";
import Summary from "../Courses/Summary";

const StudentDashboard = ({ fullname, matNo, sidebarCollapsed }) => {
    const { Content } = Layout;
    const titleLevel = useDynamicTitleLevel();

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " md:ml-[35px] lg:ml-[60px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Typography.Title
                style={{
                    fontFamily: "Robtto",
                }}
                level={titleLevel}
                className="uppercase mb-6"
            >
                Welcome, {fullname}
            </Typography.Title>
            <p className="text-md text-gray-600">
                Matriculation Number: {matNo}
            </p>

            {/* Show Summary only for students */}
            <Typography className="my-[2.5rem]">
                <Summary
                    sidebarCollapsed={sidebarCollapsed}
                    fetchStudentStats={true}
                    showEmptyState={true}
                />
            </Typography>
        </Content>
    );
};

export default StudentDashboard;
