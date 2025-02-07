// import { toast } from "react-toastify";
// import { generateQRCode } from "../api/api"; // Assuming generateQRCode is the function from API

// // Function to handle QR Code generation
// export const handleQRCodeGeneration = async (
//     values,
//     setLoading,
//     form,
//     onClose,
// ) => {
//     setLoading(true);
//     try {
//         await generateQRCode(values);
//         toast.success("QR Code generated successfully!");
//         form.resetFields();
//         onClose(); // Close modal after success
//     } catch (error) {
//         toast.error(`${error}`);
//     } finally {
//         setLoading(false);
//     }
// };


import { toast } from "react-toastify";
import { generateQRCode } from "../api/api"; // API call function

export const handleQRCodeGeneration = async (
    values,
    setLoading,
    form,
    onClose,
) => {
    setLoading(true);
    try {
        // Get BASE_URL from Vite environment variable
        const BASE_URL =
            import.meta.env.VITE_BASE_URL || "http://localhost:5173";

        // Construct the QR Code URL
        const qrCodeUrl = `${BASE_URL}/?course_code=${
            values.course_code
        }&lecturer_id=${localStorage.getItem("userId")}`;

        // Add the generated URL to the form data
        const requestData = {
            ...values,
            url: qrCodeUrl, // Save the QR code link
        };

        // Send request to the backend
        await generateQRCode(requestData);
        toast.success("QR Code generated successfully!");

        // Reset form & close modal
        form.resetFields();
        onClose();
    } catch (error) {
        toast.error(`Failed to generate QR Code: ${error}`);
    } finally {
        setLoading(false);
    }
};
