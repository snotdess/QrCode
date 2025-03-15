import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import {
    CustomButton,
    CustomParagraph,
    CustomSubtitle,
    CustomTitle,
} from "../CustomTypography";
import qrImage from "/qr_attendance.png";

const HeroSection = () => {
    const navigate = useNavigate();

    const reDirect = () => {
        navigate("/onboarding");
    };
    return (
        <div className="min-h-screen  md:min-h-[60vh] lg:min-h-[80vh] flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-16 gap-[1rem]">
            {/* Left Section - Text */}
            <div className="text-center md:text-left md:w-1/2">
                <CustomTitle className="!leading-tight">
                    Seamless Attendance Tracking
                    <CustomSubtitle className="my-[0.4rem]" color={"blue"}>
                        <span className="text-[1rem]">Using QR-Code</span>
                    </CustomSubtitle>
                </CustomTitle>
                <CustomParagraph className="text-base md:text-lg max-w-lg">
                    Generate, Capture and Track Student attendance in real-time
                    effortlessly.
                </CustomParagraph>
                <div className="mt-6 flex flex-col justify-center md:justify-normal sm:flex-row items-center gap-4">
                    <CustomButton
                        type="primary"
                        size="large"
                        className="py-[1.5rem] shadow-lg outline-none hover:border-b-[#32de84] "
                        onClick={reDirect}
                    >
                        Get Started
                    </CustomButton>
                </div>
            </div>

            {/* Right Section - Image */}
            <div className="md:w-1/2 flex justify-center">
                <Image
                    src={qrImage}
                    alt="QR Code Attendance"
                    className="w-full p-1 object-contain shadow-sm max-w-[350px] sm:max-w-[450px] md:max-w-[650px] h-auto"
                    preview={false}
                />
            </div>
        </div>
    );
};

export default HeroSection;
