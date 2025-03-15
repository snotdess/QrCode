import { redirect, useNavigate } from "react-router-dom";
import {
    CustomButton,
    CustomParagraph,
    CustomTitle,
} from "../CustomTypography";

const CallToAction = () => {
    const navigate = useNavigate();

    const reDirect = () => {
        navigate("/onboarding");
    };
    return (
        <div className="my-7 py-20 text-center bg-gray-50">
            <CustomTitle className="">
                Get Started with GeoQR
            </CustomTitle>
            <CustomParagraph className="">
                Sign up today and start tracking attendance effortlessly!
            </CustomParagraph>
            <CustomButton
                type="primary"
                size="large"
                className="py-[1.5rem] shadow-lg outline-none hover:border-b-[#32de84] "
                onClick={reDirect}
            >
                Get Started
            </CustomButton>
        </div>
    );
};

export default CallToAction;
