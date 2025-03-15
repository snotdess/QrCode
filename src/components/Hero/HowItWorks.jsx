import {
    BarChartOutlined,
    CheckCircleOutlined,
    ScanOutlined,
} from "@ant-design/icons";
import { Layout, Steps } from "antd";
import { useState } from "react";
import { CustomButton, CustomTitle } from "../CustomTypography";

const { Step } = Steps;

const HowItWorks = () => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="my-4 py-20 container mx-auto text-center px-6">
            <CustomTitle className="text-gray-800 my-[1.5rem]">
                How It Works
            </CustomTitle>
            <Layout.Content className="max-w-4xl mx-auto ">
                {/* Desktop - Horizontal Steps */}

                <div className="hidden md:block">
                    <Steps
                        current={current}
                        onChange={setCurrent}
                        size="large"
                        className="md:flex w-full justify-between items-center"
                    >
                        <Step
                            title={
                                <div className="flex flex-col items-center">
                                    <span>Generate QR Code</span>
                                </div>
                            }
                            icon={
                                <ScanOutlined className="text-blue-500 text-2xl" />
                            }
                            description="Lecturer generates a unique QR code for the session."
                        />
                        <Step
                            title={
                                <div className="flex flex-col items-center">
                                    <span>Scan & Mark</span>
                                </div>
                            }
                            icon={
                                <CheckCircleOutlined className="text-green-500 text-2xl" />
                            }
                            description="Students scan the QR code to confirm their attendance."
                        />
                        <Step
                            title={
                                <div className="flex flex-col items-center">
                                    <span>View Reports</span>
                                </div>
                            }
                            icon={
                                <BarChartOutlined className="text-purple-500 text-2xl" />
                            }
                            description="Attendance records are instantly saved and accessible."
                        />
                    </Steps>
                </div>

                {/* Mobile - Vertical Steps */}
                <Layout.Content className="md:hidden flex items-center justify-center">
                    <Steps
                        current={current}
                        direction="vertical"
                        size="small"
                        className="flex md:hidden"
                    >
                        <Step
                            title="Generate QR Code"
                            icon={
                                <ScanOutlined className="text-blue-500 text-2xl" />
                            }
                            description="Lecturer generates a unique QR code for the session."
                        />
                        <Step
                            title="Scan & Mark"
                            icon={
                                <CheckCircleOutlined className="text-green-500 text-2xl" />
                            }
                            description="Students scan the QR code to confirm their attendance."
                        />
                        <Step
                            title="View Reports"
                            icon={
                                <BarChartOutlined className="text-purple-500 text-2xl" />
                            }
                            description="Attendance records are instantly saved and accessible."
                        />
                    </Steps>
                </Layout.Content>

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <CustomButton
                        onClick={() =>
                            setCurrent((prev) => Math.max(prev - 1, 0))
                        }
                        className={`px-4 py-[1.5rem] shadow-lg border outline-none rounded-md ${
                            current === 0
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-blue-600 border-blue-600 hover:bg-blue-50"
                        }`}
                        disabled={current === 0}
                    >
                        Previous
                    </CustomButton>
                    <CustomButton
                        onClick={() =>
                            setCurrent((prev) => Math.min(prev + 1, 2))
                        }
                        className={`px-4 py-[1.5rem] shadow-lg border outline-none rounded-md ${
                            current === 2
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-green-600 border-green-600 hover:bg-green-50"
                        }`}
                        disabled={current === 2}
                    >
                        Next
                    </CustomButton>
                </div>
            </Layout.Content>
        </div>
    );
};

export default HowItWorks;
