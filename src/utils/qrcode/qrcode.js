// src/utils/qrcode/qrcode.js

import jsQR from "jsqr";
import { toast } from "react-toastify";
import {
    deleteQRCode,
    generateQRCode,
    getLecturerLatestQRCodes,
} from "../../api/api";

/**
 * Generates a QR code URL with location and timestamp data, then submits it to the server.
 * Handles loading states, form reset, and error notifications.
 */
export const handleQRCodeGeneration = async (
    values,
    setLoading,
    form,
    onClose,
) => {
    setLoading(true);
    try {
        const BASE_URL =
            import.meta.env.VITE_BASE_URL;

        const lecturerId = localStorage.getItem("lecturer_id");

        const { latitude, longitude, course_code } = values;

        if (!lecturerId) {
            toast.error("Lecturer ID is missing. Please log in again.");
            setLoading(false);
            return;
        }

        if (!latitude || !longitude) {
            toast.error("Location data (latitude/longitude) is missing.");
            setLoading(false);
            return;
        }

        // Get current UTC timestamp
        const generationTimestamp = new Date().toISOString(); // Example: "2025-02-07T23:56:36.343Z"

        // Construct QR Code URL with generation timestamp
        const params = new URLSearchParams({
            course_code,
            lecturer_id: lecturerId,
            latitude,
            longitude,
            generated_at: generationTimestamp, // Include UTC timestamp
        });

        const qrCodeUrl = `${BASE_URL}/?${params.toString()}`;

        const requestData = {
            ...values,
            url: qrCodeUrl,
        };

        await generateQRCode(requestData);
        toast.success("QR Code generated successfully!");
        form.resetFields();
        onClose();
    } catch (error) {
        toast.error(`Failed to generate QR Code: ${error}`);
    } finally {
        setLoading(false);
    }
};

/**
 * Processes scanned QR code data, extracts relevant information, and updates the form and state.
 */
export const processQRCode = (qrCodeData, setScannedData, form, closeModal) => {
    try {
        const url = new URL(qrCodeData);
        const params = new URLSearchParams(url.search);
        const extractedData = {
            course_code: params.get("course_code"),
            lecturer_id: params.get("lecturer_id"),
            lecturer_latitude: parseFloat(params.get("latitude")),
            lecturer_longitude: parseFloat(params.get("longitude")),
            generated_at: params.get("generated_at"),
        };

        setScannedData(extractedData);
        form.setFieldsValue(extractedData);

        if (closeModal) closeModal(false); // Close the camera modal if it exists
    } catch (error) {
        toast.error("Invalid QR code format.");
    }
};

/**
 * Handles the QR code scan result and triggers the processing function.
 */
export const handleScan = (result, processQRCodeFn) => {
    if (result) {
        processQRCodeFn(result);
    }
};

/**
 * Processes an uploaded image to detect and decode a QR code.
 */
export const handleImageUpload = async (file, processQRCodeFn) => {
    const reader = new FileReader();
    reader.onload = () => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(
                0,
                0,
                image.width,
                image.height,
            );
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
            );
            if (code) {
                processQRCodeFn(code.data);
            } else {
                toast.error("No QR code found in the image.");
            }
        };
        image.src = reader.result;
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
};

/**
 * Fetches the lecturer's latest QR codes and updates the state.
 */
export const fetchQRCodes = async ({ setQRCodes, setLoading }) => {
    try {
        const data = await getLecturerLatestQRCodes();
        const response = data?.data || [];

        if (response.length > 0) {
            // Group QR codes by course_name and keep the latest one
            const latestQRCodes = response
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime)) // Sort by latest datetime
                .reduce((acc, curr) => {
                    if (
                        !acc.some((qr) => qr.course_name === curr.course_name)
                    ) {
                        acc.push(curr); // Add only the latest entry per course_name
                    }
                    return acc;
                }, []);

            setQRCodes(latestQRCodes);
        } else {
            toast.info("No Qrcode within the hour");
        }
    } catch (error) {
        toast.error(`${error}`);
    } finally {
        setLoading(false);
    }
};


/**
 * Downloads the QR code image for a given course.
 */
export const downloadQRCode = (courseName, canvasRefs) => {
    const canvas = canvasRefs.current[courseName];
    if (canvas && canvas.toDataURL) {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${courseName}_QRCode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        toast.error("QR Code download failed.");
    }
};

/**
 * Deletes a QR code for a specific course and updates the state.
 */
export const handleDelete = async (courseName, setQRCodes) => {
    try {
        await deleteQRCode(courseName);
        setQRCodes((prevQRCodes) =>
            prevQRCodes.filter((qr) => qr.course_name !== courseName),
        );
        toast.success(`QR Code for ${courseName} deleted successfully.`);
    } catch (error) {
        toast.error(`Failed to delete QR Code: ${error}`);
    }
};
