
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceForm from "../../components/Form/AttendanceForm";
import { toast } from "react-toastify";

const Attendance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleClose = () => {
        setIsModalOpen( false );
        toast.info("Atttendance Form Closed")
        setTimeout( () => {
            navigate("/dashboard");
        }, 500);

    };

    return (
        <Modal
            title="Mark Attendance"
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
