import {
    DeleteOutlined,
    DownloadOutlined,
    EyeOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { Button, Empty, Modal, Popconfirm, Table, Typography } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import {
    downloadQRCode,
    fetchQRCodes,
    handleDelete,
    handleViewQRCode,
} from "../../utils/qrcode/qrcode";
import Loader from "../Loader/Loader";

const { Text } = Typography;

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [zoom, setZoom] = useState(1);
    const canvasRefs = useRef({});

    useEffect(() => {
        fetchQRCodes({ setQRCodes, setLoading });
    }, []);

    const handleZoomIn = () => {
        setZoom((prev) => prev + 0.5);
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(0.1, prev - 0.5));
    };

    const columns = [
        {
            title: "S/N",
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
        },
        { title: "Course Name", dataIndex: "course_name", key: "course_name" },
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
                <div>
                    <QRCodeCanvas
                        value={record.course_name.trim()}
                        size={150}
                        level="H"
                        includeMargin={true}
                        ref={(el) =>
                            (canvasRefs.current[record.course_name] = el)
                        }
                    />
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() =>
                            downloadQRCode(record.course_name, canvasRefs)
                        }
                    >
                        Download
                    </Button>
                </div>
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

    if (loading) return <Loader />;

    return (
        <div className="my-[2rem]">
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

            {/* View QR Code Modal */}
            <Modal
                title="QR Code Image"
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setZoom(1); // Reset zoom when closing modal
                }}
                footer={null}
                centered
                width={700} // Increased modal width
                closeIcon={
                    <CloseOutlined
                        style={{
                            position: "absolute",
                            top: "-10px", // Moves the X upward
                            right: "-10px",
                            fontSize: "24px",
                        }}
                    />
                }
            >
                <div
                    style={{
                        textAlign: "center",
                        fontFamily: "Roboto, sans-serif",
                    }}
                >
                    <Text
                        strong
                        style={{
                            fontSize: "16px",
                            marginBottom: "10px",
                            display: "block",
                        }}
                    >
                        {selectedCourseName}
                    </Text>
                    {selectedQRCode && (
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                            }}
                        >
                            {/* QR Code Preview with zoom */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    transform: `scale(${zoom})`,
                                    transformOrigin: "center",
                                }}
                            >
                                <QRCodeCanvas
                                    value={selectedQRCode.trim()}
                                    size={250}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            {/* Zoom Buttons positioned in the bottom-right corner of the preview container */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-250px",
                                    right: "",
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                <Button size="small" onClick={handleZoomOut}>
                                    -
                                </Button>
                                <Button size="small" onClick={handleZoomIn}>
                                    +
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LatestQRCodes;
