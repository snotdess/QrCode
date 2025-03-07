import {
    DeleteOutlined,
    DownloadOutlined,
    EyeOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Empty, Modal, Popconfirm, Table } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import {
    downloadQRCode,
    fetchQRCodes,
    handleDelete,
    handleViewQRCode,
} from "../../utils/qrcode/qrcode";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQRCode, setSelectedQRCode] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [qrSize, setQrSize] = useState(300);
    const canvasRefs = useRef({});

    useEffect(() => {
        fetchQRCodes({ setQRCodes, setLoading });
    }, []);

    const handleZoomIn = () => {
        setQrSize((prevSize) => prevSize + 50);
    };

    const handleZoomOut = () => {
        setQrSize((prevSize) => Math.max(100, prevSize - 50));
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        toast.info("View QR Code modal closed");
    };

    const columns = [
        {
            title: "S/N",
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Course Name",
            dataIndex: "course_name",
            key: "course_name",
        },
        {
            title: "View",
            key: "view",
            render: (_, record) => (
                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() =>
                        handleViewQRCode(
                            record,
                            setSelectedQRCode,
                            setSelectedCourseName,
                            setModalVisible,
                        )
                    }
                >
                    View
                </Button>
            ),
        },
        {
            title: "Download",
            key: "download",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() =>
                        downloadQRCode(record.course_name, canvasRefs)
                    }
                >
                    Download
                </Button>
            ),
        },
        {
            title: "Delete",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title={`Delete QR Code for ${record.course_name}?`}
                    onConfirm={() =>
                        handleDelete(record.course_name, setQRCodes)
                    }
                    okText="Yes"
                    cancelText="No"
                    cancelButtonProps={{
                        style: {
                            color: "red",
                        },
                    }}
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="my-[2rem]">
            <div
                style={{
                    position: "absolute",
                    left: "-9999px",
                    visibility: "hidden",
                }}
            >
                {qrCodes.map((record, index) => (
                    <QRCodeCanvas
                        key={`${record.course_name}-${index}`}
                        value={record.qr_code_link}
                        size={300}
                        level="H"
                        includeMargin={true}
                        ref={(canvas) => {
                            if (canvas && canvas.toDataURL) {
                                canvasRefs.current[record.course_name] = canvas;
                            }
                        }}
                    />
                ))}
            </div>

            {qrCodes.length === 0 ? (
                <Empty description="No QR Codes Available" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={Array.isArray(qrCodes) ? qrCodes : []}
                    rowKey="course_name"
                    className="mt-6"
                    pagination={{ pageSize: 5 }}
                    bordered
                    scroll={{ x: true }}
                />
            )}

            {/* Modal for viewing QR Code */}
            <Modal
                title={`QR Code for ${selectedCourseName}`}
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={window.innerWidth < 768 ? "90%" : 850}
                className="bg-transparent shadow-none"
                style={{ background: "none" }}
            >
                <div className="flex flex-col items-center gap-4">
                    {selectedQRCode && (
                        <QRCodeCanvas
                            value={selectedQRCode}
                            size={qrSize}
                            level="H"
                            marginSize={true}
                        />
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleZoomOut}
                            icon={<MinusOutlined />}
                        />
                        <Button
                            onClick={handleZoomIn}
                            icon={<PlusOutlined />}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LatestQRCodes;
