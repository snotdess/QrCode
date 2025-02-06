import { Button, Image, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const { Title, Paragraph } = Typography;

    const navigate = useNavigate();

    const reDirect = () => {
        navigate("/onboarding");
    };
    return (
        <section className=" min-h-[90vh] md:min-h-screen flex items-center justify-center md:justify-between">
            <section className="mt-2">
                <Title
                    level={1}
                    className="mb-8"
                    style={{
                        fontFamily: "Robotto, sans-serif",
                    }}
                >
                    Streamline Attendance Tracking
                    <span className="text-blue-600 my-[1rem] block">
                        Using QR-Code
                    </span>
                    Enabled System!{" "}
                </Title>
                <Paragraph
                    className="mt-[1.5rem] text-[0.85rem]"
                    style={{
                        fontFamily: "Robotto, sans-serif",
                    }}
                >
                    Capture and Track Student attendance!
                </Paragraph>
                <Button
                    onClick={reDirect}
                    className="mt-[1.5rem] py-[1.5rem] shadow-lg outline-none hover:border-b-[#32de84] text-white"
                    variant="solid"
                    type="primary"
                >
                    Get Started
                </Button>
            </section>

            <section className="hidden md:flex md:w-[50%] lg:w-[50%] items-center justify-center">
                <Image
                    src="/Home.png"
                    alt="Home.jpg"
                    className="w-[80%] object-contain shadow-sm p-1"
                />
            </section>
        </section>
    );
};

export default HeroSection;
