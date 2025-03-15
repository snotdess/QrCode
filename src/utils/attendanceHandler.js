import { toast } from "react-toastify";
import { message } from "antd";
import { scanQRCodeAttendance } from "../api/api";


// Function to handle attendance submission
export const submitAttendance = async (
    form,
    scannedData,
    onSuccess,
    setScannedData,
) => {
    try {
        const values = form.getFieldsValue(true);

        if (!scannedData) {
            toast.error("Please scan a valid QR code.");
            return;
        }

        const matricNumber = localStorage.getItem("matric_number"); // Get from local storage
        if (!matricNumber) {
            toast.error("Matric number not found. Please log in again.");
            return;
        }

        const requestData = {
            matric_number: matricNumber, // Use stored matric number
            course_code: scannedData.course_code,
            latitude: values.student_latitude,
            longitude: values.student_longitude,
            lecturer_id: scannedData.lecturer_id,
        };

        await scanQRCodeAttendance(requestData);

        toast.success("Attendance marked successfully!");

        setTimeout(() => {
            form.resetFields();
            setScannedData(null);
        }, 250);

        if (onSuccess) {
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }
    } catch (error) {
        toast.error(error || "Error submitting attendance.");
    }
};


// Function to handle location fetching
export const handleGetLocation = async (fetchLocation, form) => {
    try {
        const location = await fetchLocation();
        if (location) {
            const latitude = parseFloat(location.latitude);
            const longitude = parseFloat(location.longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                form.setFieldsValue({
                    student_latitude: latitude,
                    student_longitude: longitude,
                });
            } else {
                message.error("Invalid location data received.");
            }
        }
    } catch (error) {
        message.error("Failed to fetch location.");
    }
};
