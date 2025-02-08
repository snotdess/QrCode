
// AttendanceForm.jsx
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import useLocation from "../../hooks/location/useLocation";
import QRCodeScanner from "../QRCode/QRCodeScanner";

const AttendanceForm = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const { fetchingLocation, fetchLocation } = useLocation();
  const [scannedData, setScannedData] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const submitAttendance = async () => {
    try {
      const values = form.getFieldsValue(true);
      console.log("Form Values:", values);
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
      toast.error("Error submitting attendance.");
    }
  };

  const handleGetLocation = async () => {
    try {
      const location = await fetchLocation();
      if (location) {
        form.setFieldsValue({
          student_latitude: location.latitude,
          student_longitude: location.longitude,
        });
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

      {/* Reusable QR Code Scanner Component */}
      <Form.Item label="QR Code">
        <QRCodeScanner
          scannedData={scannedData}
          setScannedData={setScannedData}
          form={form}
          setIsScannerOpen={setIsScannerOpen}
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
