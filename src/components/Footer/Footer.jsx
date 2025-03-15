import { Layout, Typography } from "antd";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const { Text } = Typography;

const Footer = ({ sidebarCollapsed, className }) => {
    return (
        <Layout
            style={{
                marginLeft: sidebarCollapsed ? "35px" : "0px",
                transition: "margin-left 0.3s",
            }}
            className={` my-4 py-5 bg-white px-6 ${className}`}
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm text-center">
                {/* Copyright */}
                <Text className="mb-3 md:mb-0">
                    © {new Date().getFullYear()} QR Code Geo-Location Attendance
                    System. All rights reserved.
                </Text>

                {/* GitHub Link */}
                <div className="flex items-center gap-3">
                    <Text className="font-semibold">Made by Project Group</Text>
                    <Link
                        to="https://github.com/snotdess/QrCode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-900"
                    >
                        <FaGithub size={20} />
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Footer;
