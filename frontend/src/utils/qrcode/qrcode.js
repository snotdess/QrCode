import { toast } from "react-toastify";
import { generateQRCode } from "../../api/api";
import jsQR from "jsqr";

export const handleQRCodeGeneration = async (
    values,
    setLoading,
    form,
    onClose,
) => {
    setLoading(true);
    try {
        const BASE_URL =
            import.meta.env.VITE_BASE_URL || "http://localhost:5173";

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






export const processQRCode = (qrCodeUrl, setScannedData, form, setIsScannerOpen) => {
    try {
        const url = new URL(qrCodeUrl);
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
        setIsScannerOpen(false);
    } catch (error) {
        toast.error("Invalid QR code format.");
    }
};

export const handleScan = (result, processQRCodeFn) => {
    if (result) {
        processQRCodeFn(result);
    }
};

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
            const imageData = context.getImageData(0, 0, image.width, image.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
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
