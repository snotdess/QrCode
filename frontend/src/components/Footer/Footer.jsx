import { Layout, Typography } from "antd";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = ({ sidebarCollapsed, className }) => {
    const { Text } = Typography;
    return (
        <Layout
            style={{
                marginLeft: sidebarCollapsed ? "35px" : "0px",
                transition: "margin-left 0.3s",
                background: "#fff",
                fontFamily: "Robotto, sans-serif",
            }}
            className={`${className}`}
        >
            <Text
                style={{
                    color: "gray",
                    fontSize: "14px",
                    fontFamily: "Robotto, sans-serif",
                }}
                className="flex flex-col text-center md:flex-row items-center justify-between"
            >
                © {new Date().getFullYear()} QR Code Geo-Location
                Attendance System. All rights reserved. <br />
                <strong className="flex mt-3 md:mt-0 items-center gap-5">
                    Made by Project Group {" "}
                    <Link to={"https://github.com/"}>
                        <FaGithub size={18} style={{ color: "#000" }} />
                    </Link>
                </strong>
            </Text>
        </Layout>
    );
};

export default Footer;
