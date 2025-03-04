import { Button, Form, Input } from "antd";
import { useState } from "react";
import useLocation from "../../hooks/location/useLocation";
import {
    handleGetLocation,
    submitAttendance,
} from "../../utils/attendanceHandler";
import QRCodeScanner from "../QRCode/QRCodeScanner";

const AttendanceForm = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const { fetchingLocation, fetchLocation } = useLocation();
    const [scannedData, setScannedData] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const customFont = { fontFamily: "Roboto, sans-serif" };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() =>
                submitAttendance(form, scannedData, onSuccess, setScannedData)
            }
            style={customFont}
        >
            <Form.Item
                label={<span style={customFont}>Matric Number</span>}
                name="matric_number"
                rules={[
                    {
                        required: true,
                        message: "Please enter your matric number",
                    },
                ]}
            >
                <Input
                    placeholder="Enter your matric number"
                    style={customFont}
                />
            </Form.Item>

            {/* QR Code Scanner Component */}
            <Form.Item label={<span style={customFont}>QR Code</span>}>
                <QRCodeScanner
                    scannedData={scannedData}
                    setScannedData={setScannedData}
                    form={form}
                    isScannerOpen={isScannerOpen}
                    setIsScannerOpen={setIsScannerOpen}
                />
            </Form.Item>

            <Form.Item label={<span style={customFont}>Get Location</span>}>
                <Button
                    type="dashed"
                    onClick={() => handleGetLocation(fetchLocation, form)}
                    loading={fetchingLocation}
                    style={customFont}
                >
                    {fetchingLocation ? "Fetching..." : "Get Current Location"}
                </Button>
            </Form.Item>

            <Form.Item
                label={<span style={customFont}>Student Latitude</span>}
                name="student_latitude"
                rules={[
                    {
                        required: true,
                        message: "Please get your current latitude",
                    },
                ]}
            >
                <Input
                    disabled
                    style={{ backgroundColor: "#fff", ...customFont }}
                />
            </Form.Item>

            <Form.Item
                label={<span style={customFont}>Student Longitude</span>}
                name="student_longitude"
                rules={[
                    {
                        required: true,
                        message: "Please get your current longitude",
                    },
                ]}
            >
                <Input
                    disabled
                    style={{ backgroundColor: "#fff", ...customFont }}
                />
            </Form.Item>

            <div className="flex items-center justify-between">
                <Form.Item>
                    <Button
                        onClick={onCancel}
                        type="primary"
                        danger
                        style={customFont}
                    >
                        Cancel
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={customFont}>
                        Submit Attendance
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default AttendanceForm;
