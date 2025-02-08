import { toast } from "react-toastify";
import { generateQRCode } from "../../api/api";

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
