import { Typography } from "antd";

const LecturerDashboard = ({ fullname, sidebarCollapsed }) => {
    const { Title } = Typography;
    return (
        <div
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                    ? " md:ml-[35px] lg:ml-[60px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <Title
                level={4}
                className="uppercase  mb-6"
                style={{
                    // fontFamily: "Robotto, sans-serif",
                    fontFamily: "Roboto"

                }}
            >
                Welcome, {fullname}
            </Title>
        </div>
    );
};

export default LecturerDashboard;
