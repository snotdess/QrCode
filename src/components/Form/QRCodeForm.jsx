import { Button, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useLocation from "../../hooks/location/useLocation";
import useLecturerCourses from "../../hooks/useLecturerCourses";
import { handleQRCodeGeneration } from "../../utils/qrcode/qrcode";

const QRCodeForm = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { fetchingLocation, fetchLocation } = useLocation();
    const { courses } = useLecturerCourses();
    const [form] = Form.useForm();

    const customFontStyle = { fontFamily: "Roboto, sans-serif" };

    const onFinish = async (values) => {
        try {
            await handleQRCodeGeneration(values, setLoading, form, onClose);
        } catch (error) {
            toast.error(`${error}`);
        }
        console.log(courses);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ course_code: undefined }}
            style={customFontStyle}
        >
            <Form.Item
                label={<span style={customFontStyle}>Course Code</span>}
                name="course_code"
                rules={[{ required: true, message: "Please select a course." }]}
            >
                <Select placeholder="Select a course" style={customFontStyle}>
                    {courses?.map((course) => (
                        <Select.Option
                            key={course.course_code}
                            value={course.course_code}
                            style={customFontStyle}
                        >
                            {course.course_code}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label={<span style={customFontStyle}>Latitude</span>}
                name="latitude"
                rules={[
                    {
                        required: true,
                        message: "Please Generate your current latitude.",
                    },
                ]}
            >
                <Input
                    placeholder="Latitude"
                    readOnly
                    style={customFontStyle}
                />
            </Form.Item>

            <Form.Item
                label={<span style={customFontStyle}>Longitude</span>}
                name="longitude"
                rules={[
                    {
                        required: true,
                        message: "Please Generate your current longitude.",
                    },
                ]}
            >
                <Input
                    placeholder="Longitude"
                    readOnly
                    style={customFontStyle}
                />
            </Form.Item>

            <Form.Item
                label={<span style={customFontStyle}>Get Location</span>}
            >
                <Button
                    type="dashed"
                    onClick={async () => {
                        try {
                            const location = await fetchLocation();
                            if (location) {
                                form.setFieldsValue({
                                    latitude: parseFloat(
                                        location.latitude,
                                    ).toFixed(2),
                                    longitude: parseFloat(
                                        location.longitude,
                                    ).toFixed(2),
                                });
                            }
                        } catch (error) {
                            toast.error("Failed to fetch location.");
                        }
                    }}
                    loading={fetchingLocation}
                    style={customFontStyle}
                >
                    {fetchingLocation ? "Fetching..." : "Get Current Location"}
                </Button>
            </Form.Item>

            <Form.Item>
                <Space className="flex items-center justify-between gap-1">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="rounded-md text-white py-4 px-4"
                        style={customFontStyle}
                    >
                        Generate QR Code
                    </Button>

                    <Button
                        onClick={onClose}
                        danger
                        className="py-4 px-4 rounded-md"
                        style={customFontStyle}
                    >
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default QRCodeForm;
