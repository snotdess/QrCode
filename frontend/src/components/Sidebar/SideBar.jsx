import {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QrcodeOutlined,
} from "@ant-design/icons";
import { Image, Layout, Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Sider } = Layout;
const customFontFamily = "Roboto, sans-serif";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    const userRole = localStorage.getItem("userRole");

    const menuItems = [
        { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
        ...(userRole === "lecturer"
            ? [
                  {
                      key: "/courses",
                      label: "Course",
                      icon: <BookOutlined />,
                  },
                  {
                      key: "/create_qrcode",
                      label: "Create QR Code",
                      icon: <QrcodeOutlined />,
                  },
              ]
            : []),
        ...(userRole === "student"
            ? [
                  {
                      key: "/selected_courses",
                      label: "Selected Courses",
                      icon: <BookOutlined />,
                  },
                  {
                      key: "/attendance",
                      label: "Mark Attendance",
                      icon: <QrcodeOutlined />,
                  },
              ]
            : []),
        { key: "*", label: "Logout", icon: <LogoutOutlined /> },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === "*") {
            // Clear all local storage
            localStorage.clear();

            toast.success("Logged out Successfully");

            setTimeout(() => {
                // Navigate to onboarding page
                navigate("/onboarding");
            }, 1500);
        } else {
            navigate(key);
        }
    };

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={260}
            breakpoint="xl"
            collapsedWidth={85}
            className="min-h-screen z-[100] fixed left-0 top-0 bottom-0 overflow-auto flex flex-col justify-between bg-[#0039a6]"
            style={{ fontFamily: customFontFamily }}
        >
            <div className="h-[64px] flex items-center justify-center">
                {collapsed ? (
                    <Image
                        src="/logo2.jpg"
                        width={50}
                        className="rounded-3xl"
                    />
                ) : (
                    <div className="flex items-center text-white gap-5 flex-col mt-[4rem]">
                        <Image
                            src="/logo2.jpg"
                            width={50}
                            className="rounded-3xl"
                        />
                        <span style={{ fontFamily: customFontFamily }}>
                            GEO-QR
                        </span>
                    </div>
                )}
            </div>

            <div>
                <Menu
                    mode="inline"
                    theme=""
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "17px",
                        justifyContent: "center",
                        color: "#fff",
                        fontFamily: customFontFamily,
                    }}
                    className="gap-5 min-h-[70vh]"
                    defaultSelectedKeys={["/dashboard"]}
                    onClick={handleMenuClick}
                    items={menuItems.map((item) => ({
                        key: item.key,
                        icon: item.icon,
                        label: (
                            <span style={{ fontFamily: customFontFamily }}>
                                {item.label}
                            </span>
                        ),
                    }))}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    cursor: "pointer",
                    fontSize: "20px",
                    fontFamily: customFontFamily,
                }}
                onClick={handleCollapse}
            >
                {collapsed ? (
                    <MenuUnfoldOutlined
                        style={{ backgroundColor: "#00563B" }}
                    />
                ) : (
                    <MenuFoldOutlined style={{ backgroundColor: "#00563B" }} />
                )}
            </div>
        </Sider>
    );
};

export default Sidebar;
