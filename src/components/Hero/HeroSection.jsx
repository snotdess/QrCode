import { Image } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    CustomButton,
    CustomParagraph,
    CustomSubtitle,
    CustomTitle,
} from "../CustomTypography";

const HeroSection = () => {
    const navigate = useNavigate();

    const reDirect = () => {
        navigate("/onboarding");
    };
    return (
        <section className=" min-h-[90vh] md:min-h-screen flex items-center justify-center md:justify-between">
            <section className="">
                <CustomTitle className="">
                    Streamline Attendance Tracking
                    <CustomSubtitle className={"my-[0.8rem]"} color={"blue"}>
                        <span style={ {
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "1.4rem",
                        }}>Using QR-Code</span>
                    </CustomSubtitle>
                    Enabled System!
                </CustomTitle>
                <CustomParagraph>
                    Capture and Track Student attendance!
                </CustomParagraph>

                <CustomButton
                    type="primary"
                    className="py-[1.5rem] shadow-lg outline-none hover:border-b-[#32de84] "
                    onClick={reDirect}
                >
                    Get Started
                </CustomButton>
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
