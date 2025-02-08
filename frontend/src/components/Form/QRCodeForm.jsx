// // components/QRCode/QRCodeForm.jsx

import { Button, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useLocation from "../../hooks/location/useLocation";
import useLecturerCourses from "../../hooks/useLecturerCourses";
import { handleQRCodeGeneration } from "../../utils/qrcode/qrcode";

const QRCodeForm = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { fetchingLocation, fetchLocation } = useLocation();
    const courses = useLecturerCourses();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await handleQRCodeGeneration(values, setLoading, form, onClose);
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleGetLocation = () => {
        fetchLocation(form);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ course_code: undefined }}
        >
            <Form.Item
                label="Course Code"
                name="course_code"
                rules={[{ required: true, message: "Please select a course." }]}
            >
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
            </Form.Item>

            <Form.Item label="Latitude" name="latitude">
                <Input placeholder="Latitude" readOnly />
            </Form.Item>

            <Form.Item label="Longitude" name="longitude">
                <Input placeholder="Longitude" readOnly />
            </Form.Item>

            <Form.Item>
                <Button
                    onClick={handleGetLocation}
                    loading={fetchingLocation}
                    block
                >
                    Get Location
                </Button>
            </Form.Item>

            <Form.Item>
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
                        onClick={onClose}
                        danger
                        className="py-4 px-4 rounded-md"
                    >
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default QRCodeForm;
