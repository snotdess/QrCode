// components/QRCodeForm.js
import { Button, Form, Input, Select, Space } from "antd";
import React from "react";
import { toast } from "react-toastify";
import useLecturerCourses from "../../hooks/useLecturerCourses";
import useLocation from "../../hooks/useLocation";
import { handleQRCodeGeneration } from "../../utils/qrcode";
import QRCodeFormItem from "./QRCodeFormItem";

const QRCodeForm = ({ onClose }) => {
    const [loading, setLoading] = React.useState(false);
    const { fetchingLocation, fetchLocation } = useLocation();
    const courses = useLecturerCourses();
    const [form] = Form.useForm();

    const formItems = [
        {
            label: "Course Code",
            name: "course_code",
            component: (
                <Select placeholder="Select a course">
                    {courses.map((course) => (
                        <Select.Option
                            key={course.course_code}
                            value={course.course_code}
                        >
                            {course.course_code}
                        </Select.Option>
                    ))}
                </Select>
            ),
            rules: [{ required: true, message: "Please select a course." }],
        },
        {
            label: "Latitude",
            name: "latitude",
            component: <Input placeholder="Latitude" readOnly />,
        },
        {
            label: "Longitude",
            name: "longitude",
            component: <Input placeholder="Longitude" readOnly />,
        },
        {
            component: (
                <Button
                    className="mb-5"
                    onClick={() => fetchLocation(form)}
                    loading={fetchingLocation}
                >
                    Get Location
                </Button>
            ),
            noFormItem: true, // This is not wrapped in a Form.Item
        },
    ];

    const onFinish = async (values) => {
        try {
            await handleQRCodeGeneration(values, setLoading, form, onClose);
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            {formItems.map((item, index) => {
                if (item.noFormItem) {
                    return <div key={index}>{item.component}</div>;
                }
                return (
                    <QRCodeFormItem
                        key={index}
                        label={item.label}
                        name={item.name}
                        component={item.component}
                        rules={item.rules}
                    />
                );
            })}

            <Space className="flex items-center justify-between gap-1">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="rounded-md text-white py-4 px-4"
                >
                    Generate QR Code
                </Button>

                <Button
                    type="primary"
                    onClick={onClose}
                    danger
                    className="text-white py-4 px-4 rounded-md"
                >
                    Cancel
                </Button>
            </Space>
        </Form>
    );
};

export default QRCodeForm;
