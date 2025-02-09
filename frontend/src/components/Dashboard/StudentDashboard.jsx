import { Layout, Typography } from "antd";
import useDynamicHeadingLevel from "../../hooks/typography/useDynamicHeadingLevel";
import Summary from "../Courses/Summary";

const StudentDashboard = ({ fullname, matNo, sidebarCollapsed }) => {
    const { Content } = Layout;
    const titleLevel = useDynamicHeadingLevel();
    const { Title } = Typography;

    return (
        <Content
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4 transition-all ${
                sidebarCollapsed
                    ? " md:ml-[35px] lg:ml-[60px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <div
                className={`mb-6 ${
                    sidebarCollapsed && "ml-[45px] md:ml-0"
                }`}
            >
                <Title
                    style={{
                        fontFamily: "Robtto",
                    }}
                    level={titleLevel}
                    className="uppercase mb-6"
                >
                    Welcome, {fullname}
                </Title>
                <p className="">
                    Matriculation Number: {matNo}
                </p>
            </div>

            {/* Show Summary only for students */}
            <Typography className="my-[2.5rem]">
                <Summary
                    sidebarCollapsed={sidebarCollapsed}
                    fetchStudentStats={true}
                    showEmptyState={true}
                />
            </Typography>

            {/* <Attendance /> */}
        </Content>
    );
};

export default StudentDashboard;
