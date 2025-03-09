import { Image, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { FaUser, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ChoiceCard from "../components/Card/ChoiceCard";
import { CustomParagraph, CustomTitle } from "../components/CustomTypography";
import Loader from "../components/Loader/Loader";

const Onboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const lecturerRedirect = () => {
        navigate("/lecturer/login");
    };
    const studentRedirect = () => {
        navigate("/student/login");
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="onboarding min-h-screen flex md:flex-row">
            {/* Left Section */}
            <div className="left w-full md:w-1/2 flex flex-col justify-center px-8 py-6">
                <Typography className="mb-5">
                    <CustomTitle className="mb-6  md:text-left">
                        Get Started
                    </CustomTitle>

                    <CustomParagraph className="text-gray-800 text-[1.05rem] font-semibold whitespace-nowrap md:text-left">
                        Select the option that best suits you
                    </CustomParagraph>
                </Typography>

                <div className="cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    {/* Using ChoiceCard component */}
                    <ChoiceCard
                        icon={
                            <FaUser className="text-blue-gray-900 text-2xl" />
                        }
                        title="Lecturer"
                        paragraph={"For course instructors and lecturers"}
                        onClick={lecturerRedirect}
                    />
                    <ChoiceCard
                        icon={
                            <FaUserShield className="text-blue-gray-900 text-2xl" />
                        }
                        title="Student"
                        paragraph={"For students seeking to capture attendance"}
                        onClick={studentRedirect}
                    />
                </div>

                <CustomParagraph
                    className="mt-[6.7rem] text-[0.75rem] md:mt-4 text-sm absolute cursor-pointer left-[55%] top-[80%]"
                    onClick={handleBackToHome}
                >
                    Home
                </CustomParagraph>
            </div>

            {/* Right Section */}
            <div className="hidden md:w-[60%] md:flex items-center justify-center py-6 sm:bg-transparent">
                <Image
                    src="/school.png"
                    alt="Onboarding Illustration"
                    className="w-[100%]  md:block hidden"
                    preview = {false}
                />
            </div>
        </div>
    );
};
export default Onboarding;
