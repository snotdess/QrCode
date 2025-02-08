import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { scanQRCodeAttendance } from "../../api/api";
import useLocation from "../../hooks/location/useLocation";
import QRCodeScanner from "../QRCode/QRCodeScanner";

const AttendanceForm = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const { fetchingLocation, fetchLocation } = useLocation();
    const [scannedData, setScannedData] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false); // This state is now properly used

    const submitAttendance = async () => {
        try {
            const values = form.getFieldsValue(true);

            if (!scannedData) {
                toast.error("Please scan a valid QR code.");
                return;
            }

            const requestData = {
                matric_number: values.matric_number,
                course_code: scannedData.course_code, // Use scanned QR data
                latitude: values.student_latitude,
                longitude: values.student_longitude,
                lecturer_id: scannedData.lecturer_id,
            };

            console.log(requestData);

            await scanQRCodeAttendance(requestData);

            toast.success("Attendance marked successfully!");

            // Reset form and scanned data after a short delay
            setTimeout(() => {
                form.resetFields();
                setScannedData(null);
            }, 250);

            // Close modal and redirect to dashboard
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1000); // 1s delay before closing
            }
        } catch (error) {
            toast.error(error || "Error submitting attendance.");
        }
    };

    const handleGetLocation = async () => {
        try {
            const location = await fetchLocation();
            if (location) {
                const latitude = parseFloat(location.latitude);
                const longitude = parseFloat(location.longitude);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    form.setFieldsValue({
                        student_latitude: latitude.toFixed(2),
                        student_longitude: longitude.toFixed(2),
                    });
                } else {
                    message.error("Invalid location data received.");
                }
            }
        } catch (error) {
            message.error("Failed to fetch location.");
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={submitAttendance}>
            <Form.Item
                label="Matric Number"
                name="matric_number"
                rules={[
                    {
                        required: true,
                        message: "Please enter your matric number",
                    },
                ]}
            >
                <Input placeholder="Enter your matric number" />
            </Form.Item>

            {/* QR Code Scanner Component with Proper Props */}
            <Form.Item label="QR Code">
                <QRCodeScanner
                    scannedData={scannedData}
                    setScannedData={setScannedData}
                    form={form}
                    isScannerOpen={isScannerOpen} // Pass state correctly
                    setIsScannerOpen={setIsScannerOpen} // Pass function correctly
                />
            </Form.Item>

            <Form.Item label="Get Location">
                <Button
                    type="dashed"
                    onClick={handleGetLocation}
                    loading={fetchingLocation}
                >
                    {fetchingLocation ? "Fetching..." : "Get Current Location"}
                </Button>
            </Form.Item>

            <Form.Item label="Student Latitude" name="student_latitude">
                <Input disabled style={{ backgroundColor: "#fff" }} />
            </Form.Item>
            <Form.Item label="Student Longitude" name="student_longitude">
                <Input disabled style={{ backgroundColor: "#fff" }} />
            </Form.Item>

            <div className="flex items-center justify-between">
                <Form.Item>
                    <Button onClick={onCancel} type="primary" danger>
                        Cancel
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Attendance
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default AttendanceForm;
