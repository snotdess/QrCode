import { Card, Form } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmit } from "../../utils/formhandlers";
import CustomFormItem from "../CustomFormItem";
import {
    CustomButton,
    CustomParagraph,
    CustomTitle,
} from "../CustomTypography";
import Loader from "../Loader/Loader";

const FormComponent = ({
    title,
    fields,
    onSubmit,
    submitButtonText,
    redirect,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(redirect.path);
    };

    const handleBackToOnboarding = () => {
        navigate("/onboarding");
    };

    return (
        <Card
            bordered={false}
            className="w-full lg:w-[60%]  md:py-2 lg:px-8 lg:py-4 px-6 md:px-16"
        >
            <CustomTitle className="text-center font-normal">
                {title}
            </CustomTitle>
            <Form
                form={form}
                style={{ fontFamily: "Roboto, sans-serif" }}
                className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
                onFinish={(values) =>
                    handleSubmit(values, onSubmit, setLoading)
                }
                layout="vertical"
            >
                <div className="mb-1 flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <CustomFormItem
                            key={index}
                            label={field.label}
                            name={field.name}
                            required={field.required}
                            type={field.type}
                            placeholder={field.placeholder}
                        />
                    ))}
                </div>

                <Form.Item>
                    <CustomButton
                        type="primary"

                        className="mt-6 p-[1.3rem] text-center w-full sm:w-3/4 md:w-[80%] max-w-[280px] md:max-w-[550px] lg:max-w-[600px] lg:w-[90%]"
                        htmlType="submit"
                    >
                        {loading ? <Loader /> : submitButtonText}
                    </CustomButton>
                </Form.Item>
                <CustomParagraph
                    className="mt-4 text-blue-600 text-[0.8rem] text-center cursor-pointer"
                    onClick={handleRedirect}
                >
                    {redirect.text}
                </CustomParagraph>
                <CustomParagraph
                    className="mt-4 text-sm absolute cursor-pointer top-[100%] right-[5%] lg:right-[-30%]"
                    onClick={handleBackToOnboarding}
                >
                    Back
                </CustomParagraph>
            </Form>
        </Card>
    );
};

export default FormComponent;

