import { toast } from "react-toastify";
import { generateQRCode } from "../api/api"; // Assuming generateQRCode is the function from API

// Function to handle QR Code generation
export const handleQRCodeGeneration = async (
    values,
    setLoading,
    form,
    onClose,
) => {
    setLoading(true);
    try {
        await generateQRCode(values);
        toast.success("QR Code generated successfully!");
        form.resetFields();
        onClose(); // Close modal after success
    } catch (error) {
        toast.error(`${error}`);
    } finally {
        setLoading(false);
    }
};
