import { Image, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import QRCodeForm from "../../components/Form/QRCodeForm";

const QRcode = () => {
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();

    const customFontStyle = { fontFamily: "Roboto, sans-serif" };

    const handleClose = () => {
        setVisible(false);
        toast.info("Closed QRcode Generation Form");

        setTimeout(() => {
            navigate("/dashboard"); // Redirect to dashboard after closing modal
        }, 500);
    };

    useEffect(() => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <Modal
            title={<span style={{ ...customFontStyle }}>Generate QR Code</span>}
            open={visible}
            onCancel={handleClose}
            footer={null}
            closable={false}
        >
            {/* Logo in the modal */}
            <div
                className="qr-code-image-container"
                style={{ textAlign: "center", marginTop: 20 }}
            >
                <Image width={200} src="qr.png" alt="QR Code Logo" />
            </div>

            <QRCodeForm onClose={handleClose} />
        </Modal>
    );
};

export default QRcode;
