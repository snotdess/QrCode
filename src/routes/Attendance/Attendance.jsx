import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AttendanceForm from "../../components/Form/AttendanceForm";

const Attendance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const customFontStyle = { fontFamily: "Roboto, sans-serif" };

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        toast.info("Atttendance Form Closed");
        setTimeout(() => {
            navigate("/dashboard");
        }, 500);
    };

    useEffect(() => {
        if (localStorage.getItem("userRole") !== "student") {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <Modal
            title={<span style={{ ...customFontStyle }}>Mark Attendance</span>}
            open={isModalOpen}
            footer={null}
            destroyOnClose
            closable={false}
        >
            <AttendanceForm onSuccess={handleClose} onCancel={handleClose} />
        </Modal>
    );
};

export default Attendance;
