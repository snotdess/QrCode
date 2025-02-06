import { Button, Card, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSubmit } from "../../utils/formhandlers"; // Import functions
import Loader from "../Loader/Loader";

const FormComponent = ({
    title,
    fields,
    onSubmit,
    submitButtonText,
    redirect,
}) => {
    const { Title } = Typography;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Determine the password field based on the current route
    const isStudentLogin = location.pathname.includes(`/student`);
    const isLecturerLogin = location.pathname.includes("/lecturer");
    const passwordFieldName = isStudentLogin
        ? "student_password"
        : isLecturerLogin
        ? "lecturer_password"
        : null;

    const handleRedirect = () => {
        navigate(redirect.path);
    };

    const handleBackToOnboarding = () => {
        navigate("/onboarding"); // Replace with the correct path for your onboarding screen
    };

    return (
        <Card
            bordered={false}
            className="w-full lg:w-[60%] md:px-4 md:py-2 lg:px-8 lg:py-4"
        >
            <Title className="text-center" level={5}>
                {title}
            </Title>
            <Form
                form={form}
                className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
                onFinish={(values) =>
                    handleSubmit(values, onSubmit, setLoading)
                }
                layout="vertical"
            >
                <div className="mb-1 flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <Form.Item
                            key={index}
                            label={field.label}
                            name={field.name}
                            rules={[
                                {
                                    required: field.required,
                                    message: `Please enter ${field.label.toLowerCase()}!`,
                                },
                            ]}
                        >
                            <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                size="large"
                                className="w-[100%] md:w-[90%]"
                            />
                        </Form.Item>
                    ))}
                </div>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        className="mt-6 p-[1.3rem] text-center"
                        htmlType="submit"
                        onLoad={false}
                        loading={loading}
                    >
                        {loading ? <Loader /> : submitButtonText}
                    </Button>
                </Form.Item>

                {/* Redirect Link */}
                <Typography
                    className="mt-4 text-blue-600 text-center cursor-pointer"
                    onClick={handleRedirect}
                >
                    {redirect.text}
                </Typography>

                <span
                    className="mt-4 text-sm absolute cursor-pointer top-[100%] right-[5%] lg:right-[-30%]"
                    onClick={handleBackToOnboarding}
                >
                    Back
                </span>
            </Form>
        </Card>
    );
};

export default FormComponent;
